const { MessageEmbed } = require('discord.js');
const { logShard, logError } = require('../console/consoleR');

exports.run = async (client, error, shard) => {
    logShard(client, 'error', shard);
    logError(error, __dirname);
    const e = new MessageEmbed()
    .setTitle('Radeon')
    .setDescription(`Shard ${shard} / ${client.shard.count} - Error\n${error.message}`)
    .setColor('DARK_RED');
    const c = client.channels.cache.get(client.config.logs.event);
    if (c) c.send(e).catch(()=>{});
}
