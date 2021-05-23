/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'invite',
    aliases: ['support'],
    tag: 'Sends Radeon\'s invite links!',
    description: 'Sends Radeon\'s invite links!',
    async run(client, message) {
        const e = new MessageEmbed()
        .setTitle('🔗 Invite Links')
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription('• [Bot Invite](https://discord.com/api/oauth2/authorize?client_id=762359941121048616&permissions=8&scope=bot)\n• [Support Server](https://discord.gg/xcZwGhSy4G)\n• [Github Repo](https://github.com/devnote-dev/Radeon)')
        .setColor(0x1e143b)
        .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
        return message.channel.send(e);
    }
}
