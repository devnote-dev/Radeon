/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');
const { logs } = require('../../config.json');

module.exports = (client, shard) => {
    client.logger.shard(shard, 'shard reconnecting...');
    const c = client.channels.cache.get(logs.event);
    if (!c) return;

    const e = new MessageEmbed()
        .setDescription(
            `<:idle_status:882270419409862708> Shard ${shard} `+
            `/ ${client.shard.count} - Reconnecting`
        )
        .setColor(15638800);

    return c.send({ embeds:[e] }).catch(()=>{});
}
