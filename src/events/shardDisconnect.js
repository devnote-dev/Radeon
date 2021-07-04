/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');
const { logShard, logWarn } = require('../dist/console');

exports.run = async (client, event, shard) => {
    logShard(client, 'discon', shard);
    logWarn(event);
    const c = client.channels.cache.get(client.config.logs.event);
    if (!c) return;
    const e = new MessageEmbed()
    .setDescription(`Shard ${shard} / ${client.shard.count} - Disconnected`)
    .setColor(15548997);
    c.send(e).catch(()=>{});
}
