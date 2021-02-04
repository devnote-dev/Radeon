const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'permissions',
    aliases: ['perms','permsof'],
    description: 'Sends the permissions that user or a specified user has.',
    guildOnly: true,
    run: async (client, message, args) => {
        let target = message.member;
        if (args.length > 0) target = message.mentions.members.first() || message.guild.member(args[0]);
        if (!target) return client.errEmb(`\`${args[0]}\` is not a valid member.`, message);
        const embed = new MessageEmbed()
        .setAuthor(`Permissions of ${target.user.tag}`, target.user.displayAvatarURL())
        .setDescription('```\n'+ message.member.permissions.toArray().map(p => p.replace(/_/g, ' ').toLowerCase()).join('\n') + '\n```')
        .setColor(0x1e143b)
        .setFooter(`Triggered By ${message.author.tag}`)
        .setTimestamp();
        message.channel.send(embed);
    }
}
