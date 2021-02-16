const {MessageEmbed} = require('discord.js');

module.exports = async client => {
    client.checkEmb = (msg, message) => {
        const e = new MessageEmbed()
        .setDescription('<:checkgreen:796925441771438080> '+ msg)
        .setColor(0x00d134);
        return message.channel.send(e);
    }

    client.errEmb = (msg, message) => {
        const e = new MessageEmbed()
        .setDescription('<:crossred:796925441490681889> '+ msg)
        .setColor(0xd10000);
        return message.channel.send(e);
    }

    client.infoEmb = (msg, message) => {
        const e = new MessageEmbed()
        .setDescription('ℹ️ '+ msg)
        .setColor(0x0054d1);
        return message.channel.send(e);
    }

    client.logEmb = (msg, user, channel) => {
        const e = new MessageEmbed()
        .setTitle('Automod Triggered')
        .addFields(
            {name: 'Rule Triggered', value: msg, inline: false},
            {name: 'User', value: `• ${user.tag}\n• ${user.id}`, inline: true},
            {name: 'Channel', value: `• ${channel}\n• ${channel.id}`, inline: true}
        )
        .setColor('ORANGE').setTimestamp();
        return e;
    }
}
