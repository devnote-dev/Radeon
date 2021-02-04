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
}
