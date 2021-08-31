/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');
const { logShard } = require('../dist/console');

exports.run = async (client, shard) => {
    logShard(client, 'resume', shard);
    const c = client.channels.cache.get(client.config.logs.event);
    if (!c) return;
    const e = new MessageEmbed()
        .setDescription(`:blue_circle: Shard ${shard} / ${client.shard.count} - Resumed`)
        .setColor(3447003);
    return c.send({ embeds:[e] }).catch(()=>{});
}
