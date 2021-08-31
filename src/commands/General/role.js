/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { Permissions, Collection } = require('discord.js');
const { parseQuotes } = require('../../dist/stringParser');
const { resolveMember, resolveRole } = require('../../functions');
const ascii = require('ascii-table');

module.exports = {
    name: 'role',
    aliases: ['r'],
    tag: 'Role Tools: subcommands for roles.',
    description: 'Role Tools: Allows for viewing, creating, deleting, and assigning roles using the subcommands below.',
    usage: 'role <User:Mention/ID> <Role:Name/Mention/ID>\nrole c/create <Name> [Color:Hex/Decimal] [Permissions:Bitfield] [Hoisted:True/False] [Mentionable:True/False]\nrole d/delete <Role:Name/Mention/ID>\nrole i/info <Role:Name/Mention/ID>\nrole l/list [Role:Name/Mention/ID]',
    cooldown: 4,
    botPerms: 268435456n,
    guildOnly: true,
    roleBypass: true,
    async run(client, message, args) {
        if (!args.length) return client.errEmb('No Subcommand Specified. See `help role` for more information.', message);
        const sub = args.lower[0];

        if (/(?:<@!?)?\d{17,19}>?/g.test(sub)) {
            if (!message.member.permissions.has(268435456n)) return message.channel.send('You are missing the `Manage Roles` permission(s) to use this command.');
            const target = message.mentions.members.first() || await resolveMember(message, args.raw);
            if (!target) return client.errEmb('Invalid Member Specified.', message);
            const role = message.mentions.roles.first() || resolveRole(message, args.raw);
            if (role instanceof Collection) {
                const rmap = role.map(r => `• ${r.name} (ID ${r.id})`).join('\n');
                return client.infoEmb(`More than one role found with similar names:\n\n${rmap}`, message);
            }
            if (!role) return client.errEmb('Role Not Found!', message);
            if (role.managed) return client.errEmb('Cannot Manage Integration/Service Roles.', message);
            if (role.comparePositionTo(message.guild.me.roles.highest) >= 0) return client.errEmb('Cannot Manage Roles Higher or Equal to Radeon.', message);
            try {
                if (target.roles.cache.has(role.id)) {
                    await target.roles.remove(role);
                    return client.infoEmb(`Updated Roles for ${target}: Removed ${role}`, message);
                } else {
                    await target.roles.add(role);
                    return client.infoEmb(`Updated Roles for ${target}: Added ${role}`, message);
                }
            } catch (err) {
                return client.errEmb(err.message, message);
            }

        } else if (sub === 'c' || sub === 'create') {
            if (!message.member.permissions.has(268435456n)) return message.channel.send('You are missing the `Manage Roles` permission(s) to use this command.');
            if (!args.raw[1]) return client.errEmb('No Name Provided.\n```\nrole create <Name> [Color:Hex/Decimal] [Permissions:Bitfield] [Hoisted:True/False] [Mentionable:True/False]\n```', message);
            const rname = parseQuotes(args.raw.slice(1).join(' '), true);
            let rcolor = 0, rperms = Permissions.DEFAULT, rhoist = false, rmention = false;
            if (args.raw[2]) rcolor = args.raw[2];
            if (args.raw[3]) rperms = BigInt(args.raw[3]);
            if (args.raw[4]) rhoist = args.lower[4] === 'true' ? true : false;
            if (args.raw[5]) rmention = args.lower[5] === 'true' ? true : false;
            if (isNaN(parseInt(rperms))) {
                client.infoEmb('Permissions provided is an invalid Bitfield. The role will be made with default permissions instead.', message);
                rperms = Permissions.DEFAULT;
            } else {
                rperms = new Permissions(rperms);
            }
            try {
                const r = await message.guild.roles.create({
                    name:        rname,
                    color:       rcolor,
                    hoist:       rhoist,
                    permissions: rperms,
                    mentionable: rmention,
                    reason: `Created By ${message.author.tag} (${message.author.id})`
                });
                return client.checkEmb(`Successfully Created the Role ${r}!`, message);
            } catch (err) {
                return client.errEmb(err.message, message);
            }

        } else if (sub === 'd' || sub === 'delete') {
            if (!message.member.permissions.has(268435456n)) return message.channel.send('You are missing the `Manage Roles` permission(s) to use this command.');
            if (!args.raw[1]) return client.errEmb('No Role Specified.\n```\nrole delete <Role:Name/Mention/ID>\n```', message);
            const role = message.mentions.roles.first() || resolveRole(message, args.raw);
            if (role instanceof Collection) {
                const rmap = role.map(r => `• ${r.name} (ID ${r.id})`).join('\n');
                return client.infoEmb(`More than one role found with similar names:\n\n${rmap}`, message);
            }
            if (!role) return client.errEmb('Role Not Found!', message);
            if (role.managed) return client.errEmb('Cannot Manage Integration/Service Roles.', message);
            if (role.comparePositionTo(message.guild.me.roles.highest) >= 0) return client.errEmb('Cannot Manage Roles Higher or Equal to Radeon.', message);
            try {
                await role.delete(`Deleted By ${message.author.tag}`);
                return client.checkEmb('Successfully Deleted the Role!', message);
            } catch (err) {
                return client.errEmb(err.message, message);
            }

        } else if (sub === 'i' || sub === 'info') {
            if (!args.raw[1]) return client.errEmb('No Role Specified.\n```\nrole info <Role:Name/Mention/ID>\n```', message);
            require('./roleinfo').run(client, message, args.raw.slice(1));

        } else if (sub === 'l' || sub === 'list') {
            if (message.guild.roles.cache.size) {
                const table = new ascii('Role List');
                table.setHeading('Name', 'ID');
                message.guild.roles.cache
                    .sort((a, b) => b.position - a.position)
                    .forEach(r => table.addRow(r.name, r.id));
                return message.channel.send(`\`\`\`\n${table.toString()}\n\`\`\``, { split: true });
            } else {
                return message.channel.send('This server has no roles.');
            }

        } else {
            return client.errEmb('Unknown Subcommand Specified. See `help role` for more information.', message);
        }
    }
}
