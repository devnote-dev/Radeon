const { MessageEmbed } = require('discord.js');

exports.run = async (client, error, shard) => {
    const e = new MessageEmbed()
    .setTitle('Radeon')
    .setDescription(`Shard ${shard} / ${client.shard.count} - Error\n${error.message}`)
    .setColor('DARK_RED');
    client.channels.cache.get(client.config.logs.event).send(e).catch(()=>{console.log});
}
