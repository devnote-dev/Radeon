const {MessageEmbed} = require('discord.js');

exports.run = async (client, event, shard) => {
    const e = new MessageEmbed()
    .setTitle('Radeon')
    .setDescription(`Shard ${shard} / ${client.shard.count} - Disconnected`)
    .setColor('RED');
    client.channels.cache.get(client.config.logs.event).send(e);
}
