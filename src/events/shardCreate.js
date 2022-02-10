/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');
const { logs } = require('../../config.json');

module.exports = (client, shard) => {
    client.logger.shard(shard, 'shard created');
    const c = client.channels.cache.get(logs.event);
    if (!c) return;

    const e = new MessageEmbed()
        .setDescription(
            `:purple_circle: Shard ${shard} `+
            `/ ${client.shard.count} - Ready`
        )
        .setColor(10181046);

    return c.send({ embeds:[e] }).catch(()=>{});
}
