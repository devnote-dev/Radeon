const {MessageEmbed} = require('discord.js');
const Guild = require('../schemas/guild-schema');

exports.run = async (client, message) => {
    const {author} = message;
    if (author.bot) return;
    const {botOwners} = client.config;
    if (!message.guild) {
        const args = message.content.trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
        if (!cmd.length) return;
        let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
        if (!command) return;
        if (command.guildOnly) {
            const embed = new MessageEmbed()
            .setAuthor(author.tag, author.displayAvatarURL({dynamic:true}))
            .setDescription('This command cannot be used in DMs.');
            return message.channel.send(embed);
        } else if (command.modOnly) {
            if (botOwners.includes(author.id)) {
                command.run(client, message, args);
                cmdlog(client, author, command, message.channel);
            } else if (command.modOnly === 'warn') {
                const embed = new MessageEmbed()
                .setAuthor(author.tag, author.displayAvatarURL({dynamic:true}))
                .setDescription('This command is for Bot Owners only.');
                return message.channel.send(embed);
            } else if (command.modOnly === 'void') return;
        } else {
            command.run(client, message, args);
            cmdlog(client, author, command, message.channel);
        }
        return;
    }

    const data = await Guild.findOne(
        { guildID: message.guild.id },
        (err, guild) => {
            if (!guild) {
                client.emit('guildCreate', message.guild);
            } else if (err) {
                console.error(err);
            }
        }
    );

    const {prefix, ignoredChannels, ignoredCommands, automod} = data;
    if (ignoredChannels.includes(message.channel.id)) return;
    if (message.content.startsWith(prefix) || /^<@!?762359941121048616>\s+/gi.test(message.content)) {
        let args;
        if (message.mentions.users.size) {
            let user = message.mentions.users.first();
            if (user.id === '762359941121048616') {
                args = message.content.trim().split(/ +/g).splice(1);
            } else {
                args = message.content.slice(prefix.length).trim().split(/ +/g);
            }
        } else {
            args = message.content.slice(prefix.length).trim().split(/ +/g);
        }
        const cmd = args.shift().toLowerCase();
        if (!cmd.length) return;
        let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
        if (!command) return;
        if (ignoredCommands.includes(command.name)) return;

        if (command.modOnly) {
            if (botOwners.includes(author.id)) {
                command.run(client, message, args);
                cmdlog(client, author, command, message.channel);
            } else if (command.modOnly === 'warn') {
                const embed = new MessageEmbed()
                .setAuthor(author.tag, author.displayAvatarURL({dynamic:true}))
                .setDescription('This command is for Bot Owners only.');
                return message.channel.send(embed);
            } else if (command.modOnly === 'void') return;
        } else if (command.modBypass || command.permissions) {
            if (botOwners.includes(author.id) || message.member.permissions.has(command.permissions)) {
                if (command.botPerms) {
                    if (message.guild.me.permissions.has(command.botPerms)) {
                        command.run(client, message, args);
                        cmdlog(client, author, command, message.channel);
                    } else {
                        return message.channel.send(`I am missing the \`${command.botPerms.join('`, `')}\` permissions to run this command.`);
                    }
                } else {
                    command.run(client, message, args);
                    cmdlog(client, author, command, message.channel);
                }
            } else {
                return message.channel.send(`You am missing the \`${command.botPerms.join('`, `')}\` permissions to run this command.`);
            }
        } else {
            if (command.botPerms) {
                if (message.guild.me.permissions.has(command.botPerms)) {
                    command.run(client, message, args);
                    cmdlog(client, author, command, message.channel);
                } else {
                    return message.channel.send(`I am missing the \`${command.botPerms.join('`, `')}\` permissions to run this command.`);
                }
            } else {
                command.run(client, message, args);
                cmdlog(client, author, command, message.channel);
            }
        }
    } else {
        if (automod.active) {
            if (automod.invites || automod.massMention.active) {
                require('../functions/messageCheck').run(client, message, automod);
            }
        }
    }
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
