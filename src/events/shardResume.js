/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');
const { logShard } = require('../console/consoleR');

exports.run = async (client, shard) => {
    logShard(client, 'resume', shard);
    const c = client.channels.cache.get(client.config.logs.event);
    if (!c) return;
    const e = new MessageEmbed()
    .setTitle('Radeon')
    .setDescription(`Shard ${shard} / ${client.shard.count} - Resumed`)
    .setColor('BLUE');
    c.send(e).catch(()=>{});
}
