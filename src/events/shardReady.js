/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');
const { logs } = require('../../config.json');

module.exports = (client, shard, guilds) => {
    client.logger.shard(shard, `shard ready (${new Date().toDateString()})`);
    const c = client.channels.cache.get(logs.event);
    if (!c) return;

    const e = new MessageEmbed()
        .setDescription(
            `<:online_status:882270392113332325> Shard ${shard} `+
            `/ ${client.shard.count} - Ready`+
            `${guilds ? '\n'+ guilds.join('\n') : ''}`
        )
        .setColor(3066993);

    return c.send({ embeds:[e] }).catch(()=>{});
}
