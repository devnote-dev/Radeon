/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');
const { logShard, logWarn } = require('../console/consoleR');

exports.run = async (client, event, shard) => {
    logShard(client, 'discon', shard);
    logWarn(event);
    const c = client.channels.cache.get(client.config.logs.event);
    if (!c) return;
    const e = new MessageEmbed()
    .setTitle('Radeon')
    .setDescription(`Shard ${shard} / ${client.shard.count} - Disconnected`)
    .setColor('RED');
    c.send(e).catch(()=>{});
}
