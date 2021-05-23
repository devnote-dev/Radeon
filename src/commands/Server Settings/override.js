/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');
const Guild = require('../../schemas/guild-schema');

module.exports = {
    name: 'override',
    aliases: ['overrides'],
    description: 'Shows the current ignored channels or commands and allows for them to be edited using the subcommands shown below.',
    usage: 'override add-channels <...Channel:Mention/ID>\noverride del-channels <...Channel:Mention/ID>\noverride add-commands <...Command:Name>\noverride del-commands <...Command:Name>',
    userPerms: 32,
    guildOnly: true,
    modBypass: true,
    async run(client, message, args) {
        const data = await Guild.findOne({ guildID: message.guild.id });
        if (!args.length) {
            let commands = 'None Set', channels = 'None Set';
            if (data.ignoredCommands.length) commands = `\`${data.ignoredCommands.join('`\n`')}\``;
            if (data.ignoredChannels.length) channels = `<#${data.ignoredChannels.join('>\n<#')}>`;
            const embed = new MessageEmbed()
            .setTitle('Override Settings')
            .addFields(
                {name: 'Ignored Commands', value: commands, inline: true},
                {name: 'Ignored Channels', value: channels, inline: true}
            )
            .setColor(0x1e143b).setTimestamp()
            .setFooter(`Triggered By ${message.author.tag}`, message.author.avatarURL());
            return message.channel.send(embed);
        } else {
            let channels = [], commands = [], count = 0, rawIDs, res;
            switch (args[0]) {
                case 'add-channel':
                case 'add-channels':
                    if (args.length < 2) return client.errEmb('Insufficient Arguments.\nUsage: `override add-channels <...Channel:Mention/ID>`', message);
                    if (message.mentions.channels.size) message.mentions.channels.forEach(c => channels.push(c.id));
                    rawIDs = args.splice(1).filter(i => !i.startsWith('<#'));
                    if (rawIDs.length) channels.push(rawIDs);
                    channels = channels.filter(c => message.guild.channels.cache.get(c));
                    channels = channels.filter(c => !data.ignoredChannels.includes(c));
                    res = await Guild.findOneAndUpdate(
                        { guildID: message.guild.id },
                        { $push:{ ignoredChannels: channels }},
                        { new: true }
                    );
                    count = channels.length - res.ignoredCommands.length;
                    if (count <= 0) client.infoEmb('No changes were made.', message);
                    else client.checkEmb(`Successfully Added ${count} channel(s)!`, message);
                    break;
                case 'del-channel':
                case 'del-channels':
                    if (args.length < 2) return client.errEmb('Insufficient Arguments.\nUsage: `override del-channels <...Channel:Mention/ID>`', message);
                    if (message.mentions.channels.size) message.mentions.channels.forEach(c => channels.push(c.id));
                    rawIDs = args.splice(1).filter(i => !i.startsWith('<#'));
                    if (rawIDs.length) channels.push(rawIDs);
                    res = await Guild.findOneAndUpdate(
                        { guildID: message.guild.id },
                        { $pullAll:{ ignoredChannels: channels }},
                        { new: true }
                    );
                    count = channels.length - res.ignoredCommands.length;
                    if (count <= 0) client.infoEmb('No changes were made.', message);
                    else client.checkEmb(`Successfully Removed ${count} channel(s)!`, message);
                    break;
                case 'add-command':
                case 'add-commands':
                    if (args.length < 2) return client.errEmb('Insufficient Arguments.\nUsage: `override add-commands <...Command:Name>`', message);
                    commands = args.splice(1).filter(c => client.commands.get(c));
                    res = await Guild.findOneAndUpdate(
                        { guildID: message.guild.id },
                        { $push:{ ignoredCommands: commands }},
                        { new: true }
                    );
                    count = commands.length - res.ignoredCommands.length;
                    if (count <= 0) client.infoEmb('No changes were made.', message);
                    else client.checkEmb(`Successfully Added ${count} command(s)!`, message);
                    break;
                case 'del-command':
                case 'del-commands':
                    if (args.length < 2) return client.errEmb('Insufficient Arguments.\nUsage: `override add-commands <...Command:Name>`', message);
                    commands = args.splice(1).filter(c => client.commands.get(c));
                    res = await Guild.findOneAndUpdate(
                        { guildID: message.guild.id },
                        { $pullAll:{ ignoredCommands: commands }},
                        { new: true }
                    );
                    count = commands.length - res.ignoredCommands.length;
                    if (count <= 0) client.infoEmb('No changes were made.', message);
                    else client.checkEmb(`Successfully Removed ${count} command(s)!`, message);
                    break;
                default:
                    client.errEmb(`Unknown Subcommand \`${args[0]}\`\nSee \`help override\` for more info.`, message);
                    break;
            }
        }
    }
}
