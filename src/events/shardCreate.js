/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');
const { logs } = require('../../config.json');
const log = require('../log');

exports.run = async (client, shard) => {
    log.shard(client, 'create', shard);
    const c = client.channels.cache.get(logs.event);
    if (!c) return;
    const e = new MessageEmbed()
        .setDescription(`:purple_circle: Shard ${shard} / ${client.shard.count} - Ready`)
        .setColor(10181046);
    return c.send({ embeds:[e] }).catch(()=>{});
}
