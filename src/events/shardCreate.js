/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');
const { logShard } = require('../dist/console');

exports.run = async (client, shard) => {
    logShard(client, 'create', shard);
    const c = client.channels.cache.get(client.config.logs.event);
    if (!c) return;
    const e = new MessageEmbed()
    .setTitle('Radeon')
    .setDescription(`Shard ${shard} / ${client.shard.count} - Ready`)
    .setColor('PURPLE');
    c.send(e).catch(()=>{});
}