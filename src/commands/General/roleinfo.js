const { MessageEmbed, Collection } = require('discord.js');
const { toDurationDefault } = require('../../functions/functions');

module.exports = {
    name: 'roleinfo',
    tag: 'Sends information about a specific role.',
    description: 'Sends information about a specified role.',
    usage: 'roleinfo <Role:Name/Mention/ID>',
    cooldown: 4,
    guildOnly: true,
    run: async (client, message, args) => {
        if (!args.length) return client.errEmb('No Role Specified.\n```\nroleinfo <Role:Name/Mention/ID>\n```', message);
        let role = message.mentions.roles.first()
        || message.guild.roles.resolve(args.join(' '))
        || message.guild.roles.cache.filter(r => r.name.toLowerCase().includes(args.join(' ').toLowerCase()));
        if (role instanceof Collection) {
            if (!role.size) return client.errEmb('Argument Specified is an Invalid Role.', message);
            if (role.size > 1) {
                let rmap = role.map(r => `• ${r.name} (ID ${r.id})`).join('\n');
                return client.infoEmb(`More than one role found with similar names:\n\n${rmap}`, message);
            }
            role = role.first();
        }
        if (!role) return client.errEmb('Argument Specified is an Invalid Role.', message);
        message.channel.startTyping();
        const embed = new MessageEmbed()
        .setTitle(`Role: ${role.name}`)
        .addField('ID', `${role.id}`, false)
        .addField('Color', role.hexColor, true)
        .addField('Position', `${role.position}`, true)
        .addField('Hoisted', `${role.hoist}`, true)
        .addField('Created At', toDurationDefault(role.createdTimestamp), false)
        .addField('Managed', `${role.managed}`, true)
        .addField('Mentionable', `${role.mentionable}`, true)
        .addField('Members', `${role.members.size}`, true)
        .addField('Permissions', `${role.permissions.bitfield} (Bitfield)`, false)
        .setColor(role.color)
        .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
        setTimeout(() => {
            message.channel.stopTyping();
            return message.channel.send(embed)
        }, 1000);
    }
}
