const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'roleinfo',
    description: 'Sends information about a specified role.',
    usage: 'roleinfo <Role:Name/Mention/ID>',
    cooldown: 4,
    guildOnly: true,
    run: async (client, message, args) => {
        if (!args.length) return client.errEmb('No Role Specified.\n```\nroleinfo <Role:Name/Mention/ID>\n```', message);
        const role = message.mentions.roles.first() || message.guild.roles.resolve(args.join(' ')) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.join(' ').toLowerCase());
        if (!role) return client.errEmb('Argument Specified is an Invalid Role.', message);
        message.channel.startTyping();
        function duration(ms) {
            const sec = Math.floor((ms / 1000) % 60).toString()
            const min = Math.floor((ms / (1000 * 60)) % 60).toString()
            const hrs = Math.floor((ms / (1000 * 60 * 60)) % 24).toString()
            const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString()
            return `${days.padStart(1, `0`)} days ${hrs.padStart(2, `0`)} hours ${min.padStart(2, `0`)} mins and ${sec.padStart(2, `0`)} seconds ago`;
        }
        const embed = new MessageEmbed()
        .setTitle(`Role: ${role.name}`)
        .addField('ID', `${role.id}`, false)
        .addField('Color', role.hexColor, true)
        .addField('Position', `${role.position}`, true)
        .addField('Hoisted', `${role.hoist}`, true)
        .addField('Created At', duration(role.createdTimestamp), false)
        .addField('Managed', `${role.managed}`, true)
        .addField('Mentionable', `${role.mentionable}`, true)
        .addField('Members', `${role.members.size}`, true)
        .addField('Permissions', `${role.permissions.bitfield} (Bitfield)`, false)
        .setColor(role.color)
        .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
        setTimeout(async () => {
            await message.channel.stopTyping()
            message.channel.send(embed)
        });
    }
}
