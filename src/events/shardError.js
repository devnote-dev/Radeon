/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');
const { logs } = require('../../config.json');
const log = require('../log');

exports.run = async (client, error, shard) => {
    log.shard(client, 'error', shard);
    log.error(error, __filename);
    const c = client.channels.cache.get(logs.event);
    if (!c) return;
    const e = new MessageEmbed()
        .setDescription(`<:dnd_status:882270447201316905> Shard ${shard} / ${client.shard.count} - Error\n\n${error.message}`)
        .setColor(10038562);
    return c.send({ embeds:[e] }).catch(()=>{});
}
