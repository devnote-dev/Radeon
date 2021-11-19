/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */

const { MessageEmbed } = require('discord.js');

function ActionEmbed(msg, ctx) {
    return new MessageEmbed()
        .setAuthor('Command Logged')
        .addFields(
            {name: 'Command', value: msg.join(' '), inline: false},
            {name: 'User', value: `• ${ctx.author.tag}\n• ${ctx.author.id}`, inline: true},
            {name: 'Channel', value: `• ${ctx.channel}\n• ${ctx.channel.id}`, inline: true}
        )
        .setColor(0x0054d1);
}

function AmodEmbed(msg, ctx) {
    return new MessageEmbed()
        .setTitle('Automod Triggered')
        .addFields(
            {name: 'Rule', value: msg, inline: false},
            {name: 'User', value: `• ${ctx.author.tag}\n• ${ctx.author.id}`, inline: true},
            {name: 'Channel', value: `• ${ctx.channel}\n• ${ctx.channel.id}`, inline: true}
        )
        .setColor('ORANGE');
}

module.exports = {
    ActionEmbed,
    AmodEmbed
}
