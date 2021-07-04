/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');
const { logShard } = require('../dist/console');

exports.run = async (client, shard) => {
    logShard(client, 'recon', shard);
    const c = client.channels.cache.get(client.config.logs.event);
    if (!c) return;
    const e = new MessageEmbed()
    .setDescription(`Shard ${shard} / ${client.shard.count} - Reconnecting`)
    .setColor(16776960);
    c.send(e).catch(()=>{});
}
