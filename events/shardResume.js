const {MessageEmbed} = require('discord.js');

exports.run = async (client, shard) => {
    const e = new MessageEmbed()
    .setTitle('Radeon')
    .setDescription(`${shard} / 1 - Resumed`)
    .setColor('BLUE');
    client.channels.cache.get(client.config.logs.event).send(e);
}
