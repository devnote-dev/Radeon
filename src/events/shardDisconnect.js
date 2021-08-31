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
        .setDescription(`<:dnd_status:882270447201316905> Shard ${shard} / ${client.shard.count} - Disconnected`)
        .setColor(15548997);
    return c.send({ embeds:[e] }).catch(()=>{});
}
