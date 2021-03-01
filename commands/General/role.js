const {Permissions} = require('discord.js');

module.exports = {
    name: 'role',
    aliases: ['r'],
    description: 'Role Tools: Allows for creating, updating, deleting, and assigning roles using the subcommands below.',
    usage: 'role <User:Mention/ID> <Role:Name/Mention/ID>\nrole c/create <Name> [Color:Hex/Decimal] [Permissions:Bitfield] [Hoisted:True/False]\nrole d/delete <Role:Name/Mention/ID>',
    guildOnly: true,
    permissions: 268435456,
    run: async (client, message, args) => {
        if (!args.length) return client.errEmb('No Subcommand Specified. See `help role` for more information.', message);
        const sub = args[0].toLowerCase();
        if (/(?:<@!?)?\d{17,19}>?/g.test(sub)) {
            const target = message.mentions.members.first() || message.guild.member(args[0]);
            if (!target) return client.errEmb('Invalid Member Specified.', message);
            const role = message.mentions.roles.first() || message.guild.roles.resolve(args.slice(1).join(' ')) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.slice(1).join(' ').toLowerCase());
            if (!role) return client.errEmb('Unknown Role Specified.', message);
            try {
                if (target.roles.cache.has(role.id)) {
                    await target.roles.remove(role);
                    return client.infoEmb(`Updated Roles for ${target}: Removed ${role}`, message);
                } else {
                    await target.roles.add(role);
                    return client.infoEmb(`Updated Roles for ${target}: Added ${role}`, message);
                }
            } catch (err) {
                client.errEmb(err.message);
            }
        } else if (sub === 'c' || sub === 'create') {
            if (!args[1]) return client.errEmb('No Name Provided.\n```\nrole create <Name> [Color:Hex/Decimal] [Permissions:Bitfield] [Hoisted:True/False]\n```', message);
            const rname = args[1];
            let rcolor = 0, rperms = 0, rhoist = false;
            if (args[2]) rcolor = args[2];
            if (args[3]) rperms = parseInt(args[3]);
            if (args[4]) rhoist = Boolean(args[4]);
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
                        permissions: rperms,
                        hoist:       rhoist
                    },
                    reason: `Created By ${message.author.tag}`
                }).then(r => client.checkEmb(`Successfully Created the Role ${r}!`, message));
            } catch (err) {
                client.errEmb(err.message, message);
            }
        } else if (sub === 'd' || sub === 'delete') {
            if (!args[1]) return client.errEmb('No Role Specified.\n```\nrole delete <Role:Name/Mention/ID>\n```', message);
            const role = message.mentions.roles.first() || message.guild.roles.resolve(args.join(' ')) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.slice(1).join(' ').toLowerCase());
            if (!role) return client.errEmb('Unknown Role Specified.', message);
            try {
                await role.delete(`Deleted By ${message.author.tag}`);
                client.checkEmb('Successfully Deleted the Role!', message);
            } catch (err) {
                client.errEmb(err.message);
            }
        } else {
            client.errEmb('Unknown Subcommand Specified. See `help role` for more information.', message);
        }
    }
}
