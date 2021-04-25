const { Permissions, MessageEmbed } = require('discord.js');
const { humanize } = require('../../functions/functions');

module.exports = {
    name: 'permissions',
    aliases: ['perms','permsof'],
    tag: 'Permissions Tools: subcommands for permissions',
    description: 'Permissions Tools: can send the permissions of a specified user or triggering user, and permissions in a specified channel.',
    usage:'permissions [User:Mention/ID]\npermissions <User:Mention/ID> in <Channel:Mention/ID>\npermissions in <Channel:Mention/ID>\npermissions create <Permission:Name>; ...;\npermissions resolve <Bitfield:Number>',
    guildOnly: true,
    run: async (client, message, args) => {
        if (args.length) {
            if (args[0].toLowerCase() == 'create') {
                if (!args[1]) return client.errEmb('No Permissions Specified.\nMake sure each permission is separated by **;**.\n```\npermissions create <Permission:Name>; ...;\n```', message);
                let perms = args.slice(1).join(' ').toUpperCase();
                if (perms.includes(';')) perms = perms.split(';'); else perms = [perms];
                let invalid = false;
                perms.forEach(p => { if (!Permissions.FLAGS[p.trim().replace(/ /g, '_')]) invalid = true });
                if (invalid) return client.errEmb('Arguments Contains Invalid Flags.', message);
                let newPerms = new Permissions();
                perms.forEach(p => newPerms.add(p.trim().replace(/ /g, '_')));
                const embed = new MessageEmbed()
                .setTitle('Permissions').setDescription(`Generated Permission Bitfield: **\`${newPerms.bitfield}\`**`)
                .setColor(0x1e143b).setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
                return message.channel.send(embed);

            } else if (args[0].toLowerCase() == 'resolve') {
                if (!args[1]) return client.errEmb('No Permission Bitfield Provided.\n```\npermissions resolve <Bitfield:Number>\n```', message);
                const bit = parseInt(args[1]);
                if (isNaN(bit)) return client.errEmb('Invalid Bitfield Provided.', message);
                const res = new Permissions(bit);
                const embed = new MessageEmbed()
                .setTitle('Permissions')
                .setDescription(`Resovled from Bitfield **\`${bit}\`**\n\`\`\`\n${res.bitfield === 8 ? 'Administrator' : humanize(res).join(', ')}\n\`\`\``)
                .setColor(0x1e143b).setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
                return message.channel.send(embed);

            } else if (args[0].toLowerCase() == 'in') {
                if (!args[1]) return client.errEmb('No Channel Specified.\n```\npermissions in <Channel:Mention/ID>\n```', message);
                const chan = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
                if (!chan) return client.errEmb('Unknown Channel Specified.', message);
                const embed = new MessageEmbed()
                .setTitle(`Permissions in ${chan.name}`)
                .setDescription(`\`\`\`\n${humanize(chan.permissionsFor(message.author)).join(', ')}\n\`\`\`\n**Bitfield:** \`${chan.permissionsFor(message.author).bitfield}\``)
                .setColor(0x1e143b).setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
                return message.channel.send(embed);

            } else {
                const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
                if (!target) return client.errEmb('Invalid Member Specified.', message);
                if (args[1] && args[1].toLowerCase() == 'in') {
                    if (!args[2]) return client.errEmb('No Channel Specified.\n```\npermissions <User:Mention/ID> in <Channel:Mention/ID>\n```', message);
                    const chan = message.mentions.channels.first() || message.guild.channels.cache.get(args[2]);
                    if (!chan) return client.errEmb('Unknown Channel Specified.', message);
                    const embed = new MessageEmbed()
                    .setAuthor(`Permissions for ${target.user.tag} in ${chan.name}`, target.user.displayAvatarURL())
                    .setDescription(`\`\`\`\n${humanize(chan.permissionsFor(target)).join(', ')}\n\`\`\`\n**Bitfield:** \`${chan.permissionsFor(target).bitfield}\``)
                    .setColor(0x1e143b).setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
                    return message.channel.send(embed);
                } else {
                    const embed = new MessageEmbed()
                    .setAuthor(`Permissions of ${target.user.tag}`, target.user.displayAvatarURL())
                    .setDescription(`\`\`\`\n${humanize(target.permissions).join(', ')}\n\`\`\`\n**Bitfield:** \`${target.permissions.bitfield}\``)
                    .setColor(0x1e143b).setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
                    return message.channel.send(embed);
                }
            }

        } else {
            const embed = new MessageEmbed()
            .setAuthor(`Permissions of ${message.author.tag}`, message.author.displayAvatarURL())
            .setDescription(`\`\`\`\n${humanize(message.member.permissions).join(', ')}\n\`\`\`\n**Bitfield:** \`${message.member.permissions.bitfield}\``)
            .setColor(0x1e143b).setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
            message.channel.send(embed);
        }
    }
}