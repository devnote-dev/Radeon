const { MessageEmbed } = require('discord.js');
const Guild = require('../../schemas/guild-schema');

module.exports = {
    name: 'modlogs',
    aliases: ['set-modlogs'],
    description: 'Shows the current modlogs settings and allows for editing using the specified settings/options below (in usage). "log-kicks" and "log-bans" will update the logging to the opposite of what it was. "reset" will reset all modlogs settings.',
    usage: 'modlogs setchannel <Channel:Mention/ID>\nmodlogs log-kicks\nmodlogs log-bans\nmodlogs reset',
    userPerms: 32,
    guildOnly: true,
    run: async (client, message, args) => {
        const data = await Guild.findOne({guildID: message.guild.id});
        if (!args.length) {
            switch (data.modLogs.kicks) {
                case true: kicks = '<:checkgreen:796925441771438080>'; break;
                case false: kicks = '<:crossred:796925441490681889>'; break;
                default: kicks = '⚠'; break;
            }
            switch (data.modLogs.bans) {
                case true: bans = '<:checkgreen:796925441771438080>'; break;
                case false: bans = '<:crossred:796925441490681889>'; break;
                default: bans = '⚠'; break;
            }
            const embed = new MessageEmbed()
            .setTitle('Server Modlogs')
            .setDescription('You can edit the modlogs settings by using `modlogs <setting> [option]`.\nSee `help modlogs` for information on the options.')
            .addFields(
                {name: 'Modlogs Channel', value: data.modLogs.channel ? `<#${data.modLogs.channel}>` : 'None Set', inline: true},
                {name: 'Log Kicks', value: kicks, inline: true},
                {name: 'Log Bans', value: bans, inline: true}
            )
            .setColor(0x1e143b)
            .setFooter(`Triggered By ${message.author.tag}`, message.author.avatarURL());
            return message.channel.send(embed);
        } else {
            switch (args[0]) {
                case 'setchannel':
                    if (args.length < 2) return client.errEmb('Insufficient Arguments.\n```\nmoglogs setchannel <Channel:Mention/ID>\n```', message);
                    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
                    if (!channel) return client.errEmb('Unknown Channel Specified.', message);
                    if (channel.type != 'text') return client.errEmb('Channel is not a default Text channel.', message);
                    const radeon = message.guild.member(client.user.id);
                    if (!radeon.permissionsIn(channel).has('SEND_MESSAGES')) return client.errEmb('I do not have `SEND MESSAGES` permissions for that channel.', message);
                    try {
                        await Guild.findOneAndUpdate(
                            { guildID: message.guild.id },
                            { $set:{ modLogs:{ channel: channel.id, kicks: data.modLogs.kicks, bans: data.modLogs.bans }}},
                            { new: true }
                        );
                        client.checkEmb(`Modlogs channel was successfully updated to ${channel}!`, message);
                    } catch (err) {
                        client.errEmb('Unknown: Failed Updating `ModLogs:Channel`. Try contacting support.', message);
                    }
                    break;
                case 'log-kicks':
                    try {
                        await Guild.findOneAndUpdate(
                            { guildID: message.guild.id },
                            { $set:{ modLogs:{ channel: data.modLogs.channel, kicks: !data.modLogs.kicks, bans: data.modLogs.bans }}},
                            { new: true }
                        );
                        client.checkEmb(`Modlogs kick logging was successfully updated to \`${!data.modLogs.kicks}\`!`, message);
                    } catch (err) {
                        client.errEmb('Unknown: Failed Updating `ModLogs:Kicks`. Try contacting support.', message);
                    }
                    break;
                case 'log-bans':
                    try {
                        await Guild.findOneAndUpdate(
                            { guildID: message.guild.id },
                            { $set:{ modLogs:{ channel: data.modLogs.channel, kicks: data.modLogs.kicks, bans: !data.modLogs.bans }}},
                            { new: true }
                        );
                        client.checkEmb(`Modlogs kick logging was successfully updated to \`${!data.modLogs.bans}\`!`, message);
                    } catch (err) {
                        client.errEmb('Unknown: Failed Updating `ModLogs:Bans`. Try contacting support.', message);
                    }
                    break;
                case 'reset':
                    try {
                        await Guild.findOneAndUpdate(
                            { guildID: message.guild.id },
                            { $set:{ modLogs:{ channel: '' }}},
                            { new: true }
                        );
                        client.checkEmb('Successfully reset all modlogs settings!', message);
                    } catch (err) {
                        client.errEmb('Unknown: Failed Resetting `ModLogs:{}`. Try contacting support.', message);
                    }
                    break;
                default:
                    client.errEmb(`Unknown setting \`${args[0]}\`\nSee \`help modlogs\` for available settings.`, message);
                    break;
            }
        }
    }
}
