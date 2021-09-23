/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');
const log = require('../log');

exports.run = async (client, shard, guilds) => {
    log.shard(client, 'ready', shard);
    const c = client.channels.cache.get(client.config.logs.event);
    if (!c) return;
    const e = new MessageEmbed()
        .setDescription(`<:online_status:882270392113332325> Shard ${shard} / ${client.shard.count} - Ready${guilds ? '\n'+ guilds.join('\n') : ''}`)
        .setColor(3066993);
    return c.send({ embeds:[e] }).catch(()=>{});
}
