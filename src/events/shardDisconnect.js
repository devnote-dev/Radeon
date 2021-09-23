/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');
const { logs } = require('../../config.json');
const log = require('../log');

exports.run = async (client, event, shard) => {
    log.shard(client, 'discon', shard);
    console.warn(event);
    const c = client.channels.cache.get(logs.event);
    if (!c) return;
    const e = new MessageEmbed()
        .setDescription(`<:dnd_status:882270447201316905> Shard ${shard} / ${client.shard.count} - Disconnected`)
        .setColor(15548997);
    return c.send({ embeds:[e] }).catch(()=>{});
}
