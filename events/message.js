const { Permissions, MessageEmbed } = require('discord.js');
const { isBotStaff, isBotOwner, humanize } = require('../functions/functions');
const { logError } = require('../console/consoleR');
const Guild = require('../schemas/guild-schema');
const Settings = require('../schemas/settings-schema');

exports.run = async (client, message) => {
    const { author, channel } = message;
    if (author.bot) return;

    const state = await Settings.findOne({ client: client.user.id });
    let lock = false;
    if (state.maintenance) {
        if (!isBotOwner(author.id)) lock = true;
    }

    if (!message.guild) {
        const args = message.content.trim().split(/\s+|\n+/g);
        const cmd = args.shift().toLowerCase();
        if (!cmd.length) return;
        let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
        if (!command) return;
        if (lock) return errMain(message);
        if (command.guildOnly) {
            const embed = new MessageEmbed()
            .setAuthor(author.tag, author.displayAvatarURL({dynamic: true}))
            .setDescription('This command cannot be used in DMs.');
            return message.channel.send(embed);
        } else if (command.modOnly) {
            if (isBotStaff(message.author.id)) {
                try {
                    cmdlog(client, author, command, channel);
                    await command.run(client, message, args);
                } catch (err) {
                    logError(err, channel.id, author.id);
                    return errNoExec(message, command.name);
                }
            } else if (command.modOnly === 'warn') {
                const embed = new MessageEmbed()
                .setAuthor(author.tag, author.displayAvatarURL({dynamic: true}))
                .setDescription('This command is for Bot Owners only.');
                return channel.send(embed);
            } else if (command.modOnly === 'void') return;
        } else {
            try {
                cmdlog(client, author, command, channel);
                await command.run(client, message, args);
            } catch (err) {
                logError(err, channel.id, author.id);
                return errNoExec(message, command.name);
            }
        }
        return;
    }

    const data = await Guild.findOne(
        { guildID: message.guild.id },
        (err, guild) => {
            if (!guild) {
                client.emit('guildCreate', message.guild);
            } else if (err) {
                logError(err, channel.id);
            }
        }
    );

    const { prefix, ignoredChannels, ignoredCommands, automod } = data;

    if (ignoredChannels.includes(channel.id)) return;
    if (
        message.content.toLowerCase().startsWith(prefix)
        || message.content.toLowerCase().startsWith(client.config.prefix)
        || /^<@!?762359941121048616>\s+/gi.test(message.content)
    ) {
        let args;
        if (message.mentions.users.size) {
            let user = message.mentions.users.first();
            if (user.id === client.user.id) {
                args = message.content.trim().split(/\s+|\n+/g).splice(1);
            }
        } else if (message.content.toLowerCase().startsWith(client.config.prefix)) {
            args = message.content.slice(client.config.prefix.length).trim().split(/\s+|\n+/g);
        } else {
            args = message.content.slice(prefix.length).trim().split(/\s+|\n+/g);
        }

        const cmd = args.shift().toLowerCase();
        if (!cmd.length) return;
        let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
        if (!command) return;
        if (lock) return errMain(message);
        if (ignoredCommands.includes(command.name)) return;

        if (!channel.permissionsFor(message.guild.me).has(2048)) return;
        if (!channel.permissionsFor(message.guild.me).has(16384)) return channel.send('I don\'t have permissions to send embeds here! Please enable this permission to use Radeon.');

        if (command.modOnly) {
            switch (command.modOnly) {
                case 1:
                    if (isBotOwner(author.id)) {
                        try {
                            cmdlog(client, author, command, channel);
                            await command.run(client, message, args);
                        } catch (err) {
                            logError(err, channel.id, author.id);
                            return errNoExec(message, command.name);
                        }
                    } else return;
                case 2:{
                    if (isBotOwner(author.id)) {
                        try {
                            cmdlog(client, author, command, channel);
                            await command.run(client, message, args);
                        } catch (err) {
                            logError(err, channel.id, author.id);
                            return errNoExec(message, command.name);
                        }
                    } else {
                        const e = new MessageEmbed()
                        .setDescription('This command is for Bot Owners only.')
                        .setColor(0x1e143b).setFooter(author.tag, author.displayAvatarURL());
                        return channel.send(e);
                    }
                }
                case 3:
                    if (isBotStaff(author.id)) {
                        try {
                            cmdlog(client, author, command, channel);
                            await command.run(client, message, args);
                        } catch (err) {
                            logError(err, channel.id, author.id);
                            return errNoExec(message, command.name);
                        }
                    } else return;
                case 4:{
                    if (isBotStaff(author.id)) {
                        try {
                            cmdlog(client, author, command, channel);
                            await command.run(client, message, args);
                        } catch (err) {
                            logError(err, channel.id, author.id);
                            return errNoExec(message, command.name);
                        }
                    } else {
                        const e = new MessageEmbed()
                        .setDescription('This command is for Bot Admins only.')
                        .setColor(0x1e143b).setFooter(author.tag, author.displayAvatarURL());
                        return channel.send(e);
                    }
                }
            }

        } else if (command.userPerms || command.botPerms) {
            if (command.botPerms) {
                if (message.guild.me.permissions.has(command.botPerms)) {
                    if (command.userPerms) {
                        if (message.member.permissions.has(command.userPerms)) {
                            if (isOnCooldown(client, author, command)) {
                                checkRateLimit(client);
                                return message.react('⏳').catch(()=>{});
                            } else {
                                try {
                                    cmdlog(client, author, command, channel);
                                    await command.run(client, message, args);
                                } catch (err) {
                                    logError(err, channel.id, author.id);
                                    return errNoExec(message, command.name);
                                }
                            }
                        } else {
                            return channel.send(`You are missing the \`${humanize(new Permissions(command.permissions))}\` permission(s) to use this command.`);
                        }
                    } else {
                        if (isOnCooldown(client, author, command)) {
                            checkRateLimit(client);
                            return message.react('⏳').catch(()=>{});
                        } else {
                            try {
                                cmdlog(client, author, command, channel);
                                await command.run(client, message, args);
                            } catch (err) {
                                logError(err, channel.id, author.id);
                                return errNoExec(message, command.name);
                            }
                        }
                    }
                } else {
                    return channel.send(`I am missing the \`${humanize(new Permissions(command.permissions))}\` permission(s) for this command.`);
                }
            } else if (command.userPerms) {
                if (message.member.permissions.has(command.userPerms)) {
                    if (isOnCooldown(client, author, command)) {
                        checkRateLimit(client);
                        return message.react('⏳').catch(()=>{});
                    } else {
                        try {
                            cmdlog(client, author, command, channel);
                            await command.run(client, message, args);
                        } catch (err) {
                            logError(err, channel.id, author.id);
                            return errNoExec(message, command.name);
                        }
                    }
                } else {
                    return channel.send(`You are missing the \`${humanize(new Permissions(command.permissions))}\` permission(s) to use this command.`);
                }
            }
        }

        } else if (command.cooldown) {
            if (isOnCooldown(client, author, command)) {
                checkRateLimit(client);
                return message.react('⏳').catch(()=>{});
            } else {
                try {
                    cmdlog(client, author, command, channel);
                    await command.run(client, message, args);
                } catch (err) {
                    logError(err, channel.id, author.id);
                    return errNoExec(message, command.name);
                }
            }

        } else {
            try {
                cmdlog(client, author, command, channel);
                await command.run(client, message, args);
            } catch (err) {
                logError(err, channel.id, author.id);
                return errNoExec(message, command.name);
            }
        }

    // Disabled until messageCheck is debugged and fixed.

    // } else {
    //     if (automod.active) {
    //         if (automod.invites || automod.massMention.active) {
    //             require('../functions/messageCheck')(client, message, automod);
    //         }
    //     }
}

function errMain(message) {
    const m = 'Radeon is currently undergoing maintenance and will be temporarily unavailable. For more information join the Support Server using the link below!\n<https://discord.gg/xcZwGhSy4G>';
    return setTimeout(() => message.channel.send(m), 500);
}

function errNoExec(message, command) {
    return message.channel.send(`Command \`${command}\` stopped running unexpectedly.\nIf you see this error regularly, contact support via the \`@Radeon support\` command.`);
}

function cmdlog(client, user, command, channel) {
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

function isOnCooldown(client, user, command) {
    if (client.cooldowns.has(user.id)) {
        const cd = client.cooldowns.get(user.id);
        if (cd.command == command.name) {
            if (Date.now() > cd.time) {
                client.cooldowns.delete(user.id);
                client.cooldowns.set(user.id, {command: command.name, time: Date.now() + (command.cooldown * 1000)});
                return false;
            } else return true;
        } else return false;
    } else {
        if (command.cooldown) client.cooldowns.set(user.id, {command: command.name, time: Date.now() + (command.cooldown * 1000)});
        return false;
    }
}

function checkRateLimit(client) {
    if (client.rlcount > 4) {
        client.rlcount--;
        return setTimeout(()=>{},500);
    } else {
        client.rlcount++;
        return;
    }
}