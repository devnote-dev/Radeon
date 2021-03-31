const { Permissions } = require('discord.js');
const { parseQuotes } = require('../../functions/stringParser');

module.exports = {
    name: 'role',
    aliases: ['r'],
    tag: 'Role Tools: subcommands for roles.',
    description: 'Role Tools: Allows for creating, updating, deleting, and assigning roles using the subcommands below.',
    usage: 'role <User:Mention/ID> <Role:Name/Mention/ID>\nrole c/create <Name> [Color:Hex/Decimal] [Permissions:Bitfield] [Hoisted:True/False] [Mentionable:True/False]\nrole d/delete <Role:Name/Mention/ID>',
    cooldown: 4,
    permissions: 268435456,
    guildOnly: true,
    run: async (client, message, args) => {
        if (!args.length) return client.errEmb('No Subcommand Specified. See `help role` for more information.', message);
        const sub = args[0].toLowerCase();
        if (/(?:<@!?)?\d{17,19}>?/g.test(sub)) {
            const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!target) return client.errEmb('Invalid Member Specified.', message);
            const role = message.mentions.roles.first() || message.guild.roles.resolve(args.slice(1).join(' ')) || message.guild.roles.cache.find(r => r.name.toLowerCase() == args.slice(1).join(' ').toLowerCase());
            if (!role) return client.errEmb('Unknown Role Specified.', message);
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
            if (!args[1]) return client.errEmb('No Name Provided.\n```\nrole create <Name> [Color:Hex/Decimal] [Permissions:Bitfield] [Hoisted:True/False] [Mentionable:True/False]\n```', message);
            const rname = parseQuotes(args.slice(1).join(' '), true);
            let rcolor = 0, rperms = 0, rhoist = false, rmention = false;
            if (args[2]) rcolor = args[2];
            if (args[3]) rperms = parseInt(args[3]);
            if (args[4]) rhoist = Boolean(args[4]);
            if (args[5]) rmention = Boolean(args[5]);
            if (isNaN(rperms)) {
                client.infoEmb('Permissions provided is an invalid Bitfield. The role will be made with default permissions instead.', message);
                rperms = 0;
            } else {
                rperms = new Permissions(rperms);
            }
            try {
                await message.guild.roles.create({
                    data:{
                        name:        rname,
                        color:       rcolor,
                        hoist:       rhoist,
                        permissions: rperms,
                        mentionable: rmention
                    },
                    reason: `Created By ${message.author.tag}`
                }).then(r => client.checkEmb(`Successfully Created the Role ${r}!`, message));
            } catch (err) {
                return client.errEmb(err.message, message);
            }
        } else if (sub === 'd' || sub === 'delete') {
            if (!args[1]) return client.errEmb('No Role Specified.\n```\nrole delete <Role:Name/Mention/ID>\n```', message);
            const role = message.mentions.roles.first() || message.guild.roles.resolve(args.join(' ')) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.slice(1).join(' ').toLowerCase());
            if (!role) return client.errEmb('Unknown Role Specified.', message);
            if (role.managed) return client.errEmb('Cannot Manage Integration/Service Roles.', message);
            if (role.comparePositionTo(message.guild.me.roles.highest) >= 0) return client.errEmb('Cannot Manage Roles Higher or Equal to Radeon.', message);
            try {
                await role.delete(`Deleted By ${message.author.tag}`);
                return client.checkEmb('Successfully Deleted the Role!', message);
            } catch (err) {
                return client.errEmb(err.message, message);
            }
        } else {
            return client.errEmb('Unknown Subcommand Specified. See `help role` for more information.', message);
        }
    }
}