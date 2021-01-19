const {MessageEmbed} = require('discord.js');

exports.run = async client => {
    console.log('Radeon is Ready!');
    client.user.setActivity('Radeon: Revamped 😎', {type:'PLAYING'});
    // Removed HOST: <NAME> temporarily
    const e = new MessageEmbed()
    .setDescription(`Radeon is Ready!\nHost: Unknown`)
    .setColor(0x63d01b)
    .setTimestamp();
    client.channels.cache.get(client.config.logs.status).send(e);
}
