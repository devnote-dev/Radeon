const { MessageEmbed } = require('discord.js');
const { logShard, logWarn } = require('../console/consoleR');

exports.run = async (client, event, shard) => {
    logShard(client, 'discon', shard);
    logWarn(event);
    const e = new MessageEmbed()
    .setTitle('Radeon')
    .setDescription(`Shard ${shard} / ${client.shard.count} - Disconnected`)
    .setColor('RED');
    const c = client.channels.cache.get(client.config.logs.event);
    if (c) c.send(e).catch(()=>{});
}
