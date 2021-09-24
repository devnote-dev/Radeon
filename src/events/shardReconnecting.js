/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');
const { logs } = require('../../config.json');
const log = require('../log');

exports.run = async (client, shard) => {
    log.shard(client, 'recon', shard);
    const c = client.channels.cache.get(logs.event);
    if (!c) return;
    const e = new MessageEmbed()
        .setDescription(`<:idle_status:882270419409862708> Shard ${shard} / ${client.shard.count} - Reconnecting`)
        .setColor(15638800);
    return c.send({ embeds:[e] }).catch(()=>{});
}
