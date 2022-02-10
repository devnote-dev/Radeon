/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');
const { logs } = require('../../config.json');

module.exports = (client, error, shard) => {
    client.logger.shard(shard, 'shard errored:');
    client.logger.error(err);
    const c = client.channels.cache.get(logs.event);
    if (!c) return;

    const e = new MessageEmbed()
        .setDescription(
            `<:dnd_status:882270447201316905> Shard ${shard} /`+
            ` ${client.shard.count} - Error\n\n${error.message}`
        )
        .setColor(10038562);

    return c.send({ embeds:[e] }).catch(()=>{});
}
