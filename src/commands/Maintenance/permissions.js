/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { Permissions, MessageEmbed } = require('discord.js');
const {
    humanize,
    resolveMember,
    resolveChannel,
    resolveRole
} = require('../../functions');

module.exports = {
    name: 'permissions',
    aliases: ['perms', 'permsof'],
    tag: 'Permissions Tools: subcommands for permissions',
    description: 'Permissions Tools: can send the permissions of a specified user or triggering user, and permissions in a specified channel.',
    usage:'permissions [User:Mention/ID]\npermissions <User:Mention/ID> in <Channel:Mention/ID>\npermissions in <Channel:Mention/ID>\npermissions create <Permission:Name>; ...;\npermissions resolve <Bitfield:Number>',
    guildOnly: true,

    async run(client, message, args) {
        if (!args.length) {
            const embed = new MessageEmbed()
                .setAuthor(`Permissions of ${message.author.tag}`, message.author.displayAvatarURL())
                .setDescription(`\`\`\`\n${checkAdmin(message.member.permissions)}\n\`\`\`\n**Bitfield:** ${message.member.permissions.bitfield}`)
                .setColor(0x1e143b)
                .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
            return message.channel.send({ embeds:[embed] });
        }

        const sub = args.lower[0];
        if (sub === 'create') {
            if (!args.raw[1]) return client.errEmb('No Permissions Specified.\nMake sure each permission is separated by **;**.\n```\npermissions create <Permission:Name>; ...;\n```', message);
            let perms = args.upper.slice(1).join(' ');
            perms = perms.includes(';')
                ? perms.split(';')
                : [perms];
            perms = perms.map(p => p.trim().replace(/ +/g, '_'));
            let valid = false;
            try {
                valid = perms.every(p => Permissions.FLAGS[p]);
            } catch {}
            if (!valid) return client.errEmb('Arguments contains invalid flags.', message);
            let newPerms = new Permissions();
            perms.forEach(p => newPerms.add(p));
            const embed = new MessageEmbed()
                .setTitle('Permissions')
                .setDescription(`Generated Permission Bitfield: **${newPerms.bitfield}**`)
                .setColor(0x1e143b)
                .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
            return message.channel.send({ embeds:[embed] });

        } else if (sub === 'resolve') {
            if (!args.raw[1]) return client.errEmb('No Permission Bitfield Provided.\n```\npermissions resolve <Bitfield:Number>\n```', message);
            if (/[^0-9]+n?/gm.test(args.raw[1])) return client.errEmb('Invalid Bitfield Provided.', message);
            const bit = BigInt(args.raw[1]);
            const res = new Permissions(bit);
            const embed = new MessageEmbed()
                .setTitle('Permissions')
                .setDescription(`Resovled from Bitfield **${bit}**:\n\`\`\`\n${checkAdmin(res)}\n\`\`\``)
                .setColor(0x1e143b)
                .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
            return message.channel.send({ embeds:[embed] });

        } else if (sub === 'in') {
            if (!args.raw[1]) return client.errEmb('No Channel Specified.\n```\npermissions in <Channel:Mention/ID>\n```', message);
            const chan = message.mentions.channels.first() || resolveChannel(message, args.raw);
            if (!chan) return client.errEmb('Unknown Channel Specified.', message);
            const embed = new MessageEmbed()
                .setTitle(`Permissions in ${chan.name}`)
                .setDescription(`\`\`\`\n${checkAdmin(chan.permissionsFor(message.author))}\n\`\`\`\n**Bitfield:** ${chan.permissionsFor(message.author).bitfield}`)
                .setColor(0x1e143b)
                .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
            return message.channel.send({ embeds:[embed] });

        } else if (sub === 'diff') {
            if (!args[2]) return client.errEmb('Insufficient Arguments\n```\npermissions diff <User/Channel/Role> <User/Channel/Role>\n```', message);
            let ent1, ent2;

            ent1 = resolveMember(message, args[1]);
            if (!ent1) ent1 = resolveChannel(message, args[1]);
            if (!ent1) ent1 = resolveRole(message, args[1]);
            if (!ent1) return client.errEmb('Member/Channel/Role not found!', message);

            ent2 = resolveMember(message, args[2]);
            if (!ent2) ent2 = resolveChannel(message, args[2]);
            if (!ent2) ent2 = resolveRole(message, args[2]);
            if (!ent2) return client.errEmb('Member/Channel/Role not found!', message);

            if (!(ent1 instanceof GuildMember) && !(ent2 instanceof GuildMember)) return client.errEmb('Cannot compare 2 different types.', message);
            if (ent1 instanceof GuildMember) {
                const diff1 = ent1.permissions.missing(ent1.permissions.bitfield);
                const diff2 = ent2.permissions.missing(ent1.permissions.bitfield);
                if (!diff1.length && !diff2.length) return client.infoEmb('Both members have the same permissions.', message);
                const embed = new MessageEmbed()
                    .setTitle('Permissions Difference')
                    .addField(`Permissions of ${ent1.user.tag}`, `\`\`\`diff\n+ ${humanize(diff1).join('\n+ ')}`, false)
                    .addField(`Permissions of ${ent2.user.tag}`, `\`\`\`diff\n- ${humanize(diff1).join('\n- ')}`, false)
                    .setColor(0x1e143b)
                    .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
                return message.channel.send({ embeds:[embed] });
            }

        } else {
            const target = message.mentions.members.first() || await resolveMember(message, [args.raw[0]]);
            if (!target) return client.errEmb('Invalid Member Specified.', message);
            if (args.lower[1] && args.lower[1] === 'in') {
                if (!args.raw[2]) return client.errEmb('No Channel Specified.\n```\npermissions <User:Mention/ID> in <Channel:Mention/ID>\n```', message);
                const chan = message.mentions.channels.first() || resolveChannel(message, [args.raw[2]]);
                if (!chan) return client.errEmb('Unknown Channel Specified.', message);
                const embed = new MessageEmbed()
                    .setAuthor(`Permissions for ${target.user.tag} in ${chan.name}`, target.user.displayAvatarURL())
                    .setDescription(`\`\`\`\n${checkAdmin(chan.permissionsFor(message.author))}\n\`\`\`\n**Bitfield:** ${chan.permissionsFor(target).bitfield}`)
                    .setColor(0x1e143b)
                    .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
                return message.channel.send({ embeds:[embed] });
            } else {
                const embed = new MessageEmbed()
                    .setAuthor(`Permissions of ${target.user.tag}`, target.user.displayAvatarURL())
                    .setDescription(`\`\`\`\n${checkAdmin(target.permissions)}\n\`\`\`\n**Bitfield:** ${target.permissions.bitfield}`)
                    .setColor(0x1e143b)
                    .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
                return message.channel.send({ embeds:[embed] });
            }
        }
    },

    async slash(client, { message }) { await this.run(client, message) }
}

function checkAdmin(p) {
    if (p.has(8n)) return 'Administrator';
    return humanize(p).join(', ');
}
