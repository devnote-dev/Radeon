const { MessageEmbed } = require('discord.js');
const { logShard } = require('../console/consoleR');

exports.run = async (client, shard) => {
    logShard(client, 'create', shard);
    const e = new MessageEmbed()
    .setTitle('Radeon')
    .setDescription(`Shard ${shard} / ${client.shard.count} - Ready`)
    .setColor('PURPLE');
    const c = client.channels.cache.get(client.config.logs.event);
    if (c) c.send(e).catch(()=>{});
}