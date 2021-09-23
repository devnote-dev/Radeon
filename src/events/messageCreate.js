/**
 * @author Piter <https://github.com/piterxyz>
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { isBotStaff, isBotOwner, humanize } = require('../dist/functions');
const { logError, logWarn } = require('../dist/console');
const { handleActionLog } = require('../automod');

// Base Error Messages
const ERRORS = {
    main: 'Radeon is currently undergoing maintenance and will be temporarily unavailable. For more information join the Support Server using the link below!\nhttps://discord.gg/xcZwGhSy4G',
    noExec: (cmd) => `Command \`${cmd}\` stopped running unexpectedly.\nIf you see this error regularly, contact support via the \`@Radeon support\` command.`,
    noEmbeds: 'I don\'t have permissions to send embeds here! Please enable this permission to use Radeon.',
    guildOnly: 'This command can only be used in servers.',
    adminOnly: 'This command is for bot admins only.',
    ownerOnly: 'This command is for bot owners only.',
    noBotPerms: (p) => `I am missing the \`${humanize(p).join('`, `')}\` permission(s) for this command.`,
    noUserPerms: (p) => `You am missing the \`${humanize(p).join('`, `')}\` permission(s) for this command.`
}

const ACTIONS = [
    'slowmode', 'clean', 'mute',
    'unmute', 'kick', 'ban',
    'massban', 'unban', 'lock',
    'unlock'
];

exports.run = async (client, message) => {
    // Partials handling
    if (message.partial) message = await message.fetch().catch(()=>{});
    if (!message) return;
    const { author, channel } = message;
    if (author.bot) return;
    // path for logging purposes
    const path = `${message.guild ? message.guild.id +'/' : ''}${channel.id}`;

    // maintenance mode checks
    const state = await client.db('settings').get(client.user.id);
    let lock = false;
    if (state && state.maintenance) {
        if (!isBotOwner(author.id)) lock = true;
    }

    // Handling DM commands
    if (!message.guild) {
        if (message.channel.partial) await message.channel.fetch();
        const args = message.content.trim().split(/\s+|\n+/g);
        const cmd = args.shift().toLowerCase();
        if (!cmd.length) return;
        let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
        if (!command) return;
        if (lock) return channel.send(EM.errMain);
        if (command.guildOnly) {
            return channel.send(EM.errGuildOnly);
        } else if (command.modOnly) {
            if (isBotStaff(author.id)) {
                try {
                    logcmd(client, author, command, channel);
                    client.stats.commands++;
                    await command.run(client, message, args);
                } catch (err) {
                    logError(err, path, author.id);
                    return channel.send(EM.errNoExec(command.name));
                }
            } else if (command.modOnly === 'warn') {
                return channel.send(EM.errOwnerOnly);
            } else if (command.modOnly === 'void') return;
        } else {
            try {
                logcmd(client, author, command, channel);
                client.stats.commands++;
                await command.run(client, message, args);
            } catch (err) {
                logError(err, path, author.id);
                return channel.send(EM.errNoExec(command.name));
            }
        }
        return;
    }

    // Fetching server database...
    const data = await client.db('guild').get(message.guild.id);
    if (!data) {
        // fallback for servers joined while offline/during downtime
        client.emit('guildCreate', message.guild);
        // might remove logging later
        logWarn(`MessageEvent guildCreate fired\n\nServer: ${message.guild.id}`);
    }

    // extracting all the necessary info
    const {
        prefix,
        deleteAfterExec,
        actionLog,
        automod,
        overrides
    } = data;

    // pretty self-explanatory
    if (overrides.ignoredCmdChannels.includes(channel.id)) return;
    client.stats.messages++;
    if (
        message.content.toLowerCase().startsWith(prefix)
        || message.content.toLowerCase().startsWith(client.config.prefix)
        || new RegExp(`^<@!?${client.user.id}>\\s+`, 'gi').test(message.content)
    ) {
        // Getting arguments, much cleaner now :D
        let args;
        if (message.mentions.users.size) {
            args = message.content.trim().split(/\s+|\\?\n+/g).slice(1);
        } else if (message.content.toLowerCase().startsWith(client.config.prefix)) {
            args = message.content.slice(client.config.prefix.length).trim().split(/\s+|\\?\n+/g);
        } else {
            args = message.content.slice(prefix.length).trim().split(/\s+|\\?\n+/g);
        }

        // Command processing
        if (!args.length) return;
        const cmd = args.shift().toLowerCase();
        if (!cmd.length) return;
        let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
        if (!command) return;
        if (lock) return channel.send(EM.errNoExec(command.name));
        if (overrides.ignoredCommands.includes(command.name)) return;

        // Checks for servers with shitty channel perms
        if (!channel.permissionsFor(message.guild.me).has(2048n)) return;
        if (!channel.permissionsFor(message.guild.me).has(16384n)) return channel.send(EM.errNoEmbeds);

        // Simplify handling cooldowns down to one line
        if (runCooldown(client, message, command)) return;

        // Handling staff commands
        if (command.modOnly) {
            if (command.modOnly < 3) {
                if (!isBotOwner(author.id)) {
                    if (command.modOnly === 2) message.reply(EM.errOwnerOnly);
                    return;
                }
            } else {
                if (!isBotStaff(author.id)) {
                    if (command.modOnly === 4) message.reply(EM.errAdminOnly);
                    return;
                }
            }
        }

        // Handling commands with perms
        // This has been rewritten 3 times now :')
        let bypass = false;
        if (command.roleBypass && overrides.roleBypass.has(command.name)) {
            const allowed = overrides.roleBypass.get(command.name);
            bypass = message.member.roles.cache.some(r => allowed.includes(r.id));
        }
        if (command.botPerms) {
            if (!message.guild.me.permissions.has(command.botPerms)) {
                if (command.modBypass && !isBotStaff(author.id)) return message.reply(EM.errNoBotPerms(command.botPerms));
            }
        }
        if (command.userPerms && !bypass) {
            if (!message.member.permissions.has(command.userPerms)) {
                if (command.modBypass && !isBotStaff(author.id)) return message.reply(EM.errNoUserPerms(command.userPerms));
            }
        }

        // final parsing before execution
        args = {
            raw: args,
            length: args.length,
            upper: args.map(a => a.toUpperCase()),
            lower: args.map(a => a.toLowerCase())
        }

        // After all checks have passed, log & run the command
        try {
            logcmd(client, author, command, channel);
            client.stats.commands++;
            await command.run(client, message, args);
            handleActionLog(actionLog, args, message);
            if (deleteAfterExec && ACTION_CMDS.includes(command.name)) message.delete().catch(()=>{});
        } catch (err) {
            logError(err, path, author.id);
            return channel.send(EM.errNoExec(command.name));
        }

    } else {
        // Processing for automod
        if (!automod.active) return;
        // permissions shit again
        if (!channel.permissionsFor(message.guild.me).has(10240n)) return; // 26624
        // Make sure we dont trigger on ignored roles
        const bypass = message.member.roles.cache.some(r => overrides.ignoredAutomodRoles.includes(r.id));
        if (bypass) return;
        if (automod.invites || automod.mentions.active) {
            try {
                await require('../automod/main')(message, automod);
            } catch (err) {
                logError(err, path);
            }
        }
        if (automod.ratelimit) {
            try {
                await require('../automod/ratelimit')(client, message, automod);
            } catch (err) {
                logError(err, path);
            }
        }
        // if (automod.filter.active || automod.zalgo.active) {
            // Coming soon ;)
        // }
    }
}

// Internal command logging
function logcmd(client, user, command, channel) {
    client.cmdlogs.add({
        user:       user.id,
        command:    command.name,
        channel:{
            id:     channel.id,
            type:   channel.type
        },
        time:       new Date().toLocaleString()
    });
    return;
}

// Command cooldown handling
function runCooldown(client, message, command) {
    if (!command.cooldown) return;
    const { author: user } = message;
    if (client.cooldowns.has(user.id)) {
        const US = client.cooldowns.get(user.id);
        if (US.has(command.name)) {
            if (Date.now() > US.get(command.name)) {
                US.set(command.name, Date.now() + (command.cooldown * 1000));
                client.cooldowns.set(user.id, US);
                return;
            } else {
                return message.react('⏳').catch(()=>{});
            }
        } else {
            US.set(command.name, Date.now() + (command.cooldown * 1000));
            client.cooldowns.set(user.id, US);
            return;
        }
    } else {
        const US = new Map().set(command.name, Date.now() + (command.cooldown * 1000));
        client.cooldowns.set(user.id, US);
        return;
    }
}
