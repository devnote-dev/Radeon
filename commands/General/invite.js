const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'invite',
    aliases: ['support'],
    description: 'Sends Radeon\'s invite links!',
    run: async (client, message) => {
        const e = new MessageEmbed()
        .setTitle('🔗 Invite Links')
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription('• [Bot Invite](https://discord.com/api/oauth2/authorize?client_id=762359941121048616&permissions=8&scope=bot)\n• [Support Server](https://discord.gg/xcZwGhSy4G)')
        .setColor(0x1e143b)
        .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
        message.channel.send(e);
    }
}
