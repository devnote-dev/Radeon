const { MessageEmbed } = require('discord.js');
const { logShard } = require('../console/consoleR');

exports.run = async (client, shard, guilds) => {
    logShard(client, 'ready', shard);
    const e = new MessageEmbed()
    .setTitle('Radeon')
    .setDescription(`Shard ${shard} / ${client.shard.count} - Ready${guilds ? '\n'+ guilds.join('\n') : ''}`)
    .setColor('GREEN');
    const c = client.channels.cache.get(client.config.logs.event);
    if (c) c.send(e).catch(()=>{});
}
