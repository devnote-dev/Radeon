/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');
const { logShard, logError } = require('../dist/console');

exports.run = async (client, error, shard) => {
    logShard(client, 'error', shard);
    logError(error, __filename);
    const c = client.channels.cache.get(client.config.logs.event);
    if (!c) return;
    const e = new MessageEmbed()
    .setDescription(`Shard ${shard} / ${client.shard.count} - Error\n\n${error.message}`)
    .setColor(10038562);
    c.send(e).catch(()=>{});
}
