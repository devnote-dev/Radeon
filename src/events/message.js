/**
 * @author Piter <https://github.com/piterxyz>
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');
const { isBotStaff, isBotOwner, humanize } = require('../dist/functions');
const { logError, logWarn } = require('../dist/console');
const Guild = require('../schemas/guild-schema');
const Settings = require('../schemas/settings-schema');

const baseEmbed = (author, msg) => {
    return new MessageEmbed()
    .setDescription(msg).setColor(0x1e143b)
    .setFooter(author.tag, author.displayAvatarURL({ dynamic: true }));
}

// Base Error Messages
const EM = {
    errMain: 'Radeon is currently undergoing maintenance and will be temporarily unavailable. For more information join the Support Server using the link below!\nhttps://discord.gg/xcZwGhSy4G',
    errNoExec: (cmd) => `Command \`${cmd}\` stopped running unexpectedly.\nIf you see this error regularly, contact support via the \`@Radeon support\` command.`,
    errNoEmbeds: 'I don\'t have permissions to send embeds here! Please enable this permission to use Radeon.',
    errGuildOnly: (u) => baseEmbed(u, 'This command can only be used in servers.'),
    errAdminOnly: (u) => baseEmbed(u, 'This command is for bot admins only.'),
    errOwnerOnly: (u) => baseEmbed(u, 'This command is for bot owners only.'),
    errNoBotPerms: (p) => `I am missing the \`${humanize(p).join('`, `')}\` permission(s) for this command.`,
    errNoUserPerms: (p) => `You am missing the \`${humanize(p).join('`, `')}\` permission(s) for this command.`
}

exports.run = async (client, message) => {
    // Partials handling
    if (message.partial) message = await message.fetch();
    const { author, channel } = message;
    if (author.bot) return;
    // path for logging purposes
    const path = `${message.guild ? message.guild.id +'/' : ''}${channel.id}`;

    // maintenance mode checks
    const state = await Settings.findOne({ client: client.user.id });
    let lock = false;
    if (state && state.maintenance) {
        if (!isBotOwner(author.id)) lock = true;
    }

    // Handling DM commands
    // Disabled for the time being as intents dont work for it
    /*
    if (!message.guild) {
        const args = message.content.trim().split(/\s+|\n+/g);
        const cmd = args.shift().toLowerCase();
        if (!cmd.length) return;
        let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
        if (!command) return;
        if (lock) return channel.send(EM.errMain);
        if (command.guildOnly) {
            return channel.send(EM.errGuildOnly(author));
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
                return channel.send(EM.errOwnerOnly(author));
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
    */

    // Fetching server database...
    const data = await Guild.findOne(
        { guildID: message.guild.id },
        (err, guild) => {
            // fallback for guildCreate event failure,
            // basically this should never happen
            if (!guild) {
                client.emit('guildCreate', message.guild);
                logWarn(`MessageEvent guildCreate fired\n\nServer: ${message.guild.id}`);
            } else if (err) {
                logError(err, path);
            }
        }
    );

    // extracting all the necessary info
    const { prefix, ignoredChannels, ignoredCommands, automod } = data;

    // pretty self-explanatory
    if (ignoredChannels.includes(channel.id)) return;
    client.stats.messages++;
    if (
        message.content.toLowerCase().startsWith(prefix)
        || message.content.toLowerCase().startsWith(client.config.prefix)
        || new RegExp(`^<@!?${client.user.id}>\s+`, 'gi').test(message.content)
    ) {
        // I hate this mess but it works,
        // please ignore it for the time being.
        let args;
        if (message.mentions.users.size) {
            let user = message.mentions.users.first();
            if (user.id === client.user.id) {
                args = message.content.trim().split(/\s+|\n+/g).splice(1);
            } else if (message.content.toLowerCase().startsWith(client.config.prefix)) {
                args = message.content.slice(client.config.prefix.length).trim().split(/\s+|\n+/g);
            } else {
                args = message.content.slice(prefix.length).trim().split(/\s+|\n+/g);
            }
        } else if (message.content.toLowerCase().startsWith(client.config.prefix)) {
            args = message.content.slice(client.config.prefix.length).trim().split(/\s+|\n+/g);
        } else {
            args = message.content.slice(prefix.length).trim().split(/\s+|\n+/g);
        }

        // Command processing
        if (!args.length) return;
        const cmd = args.shift().toLowerCase();
        if (!cmd.length) return;
        let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
        if (!command) return;
        if (lock) return channel.send(EM.errNoExec(command.name));
        if (ignoredCommands.includes(command.name)) return;

        // Checks for servers with shitty channel perms
        if (!channel.permissionsFor(message.guild.me).has(2048)) return;
        if (!channel.permissionsFor(message.guild.me).has(16384)) return channel.send(EM.errNoEmbeds);

        // Simplify handling cooldowns down to one line
        if (runCooldown(client, message, command)) return;

        // Handling staff commands
        if (command.modOnly) {
            if (command.modOnly < 3) {
                if (!isBotOwner(author)) {
                    if (command.modOnly == 2) channel.send(EM.errOwnerOnly(author));
                }
            } else if (command.modOnly > 3) {
                if (!isBotStaff(author)) {
                    if (command.modOnly == 4) channel.send(errAdminOnly(author));
                }
            }
        }

        // Handling commands with perms
        // This has been rewritten 3 times now :')
        if (command.botPerms) {
            if (!message.guild.me.permissions.has(command.botPerms)) {
                if (command.modBypass && !isBotStaff(author)) return channel.send(EM.errNoBotPerms(command.botPerms));
            }
        }
        if (command.userPerms) {
            if (!message.member.permissions.has(command.userPerms)) {
                if (command.modBypass && !isBotStaff(author)) return channel.send(EM.errNoUserPerms(command.userPerms));
            }
        }

        // After all checks have passed, log & run the command
        try {
            logcmd(client, author, command, channel);
            client.stats.commands++;
            await command.run(client, message, args);
        } catch (err) {
            logError(err, path, author.id);
            return channel.send(EM.errNoExec(command.name));
        }

    } else {
        // Processing for automod
        if (!automod.active) return;
        if (!channel.permissionsFor(message.guild.me).has(10240)) return;
        if (automod.invites || automod.massMention.active) {
            try {
                await require('../functions/amod-main')(message, automod);
            } catch (err) {
                logError(err, path);
            }
        }
        if (automod.rateLimit) {
            try {
                await require('../functions/amod-ratelimit')(client, message, automod);
            } catch (err) {
                logError(err, path);
            }
        }
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

// Removed from active use for now, might be removed
// function checkRateLimit(client) {
//     if (client.rlcount > 4) {
//         client.rlcount--;
//         return new Promise(res => setTimeout(res, 500));
//     } else {
//         client.rlcount++;
//         return;
//     }
// }
