/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');
const { logShard, logError } = require('../console/consoleR');

exports.run = async (client, error, shard) => {
    logShard(client, 'error', shard);
    logError(error, __filename);
    const c = client.channels.cache.get(client.config.logs.event);
    if (!c) return;
    const e = new MessageEmbed()
    .setTitle('Radeon')
    .setDescription(`Shard ${shard} / ${client.shard.count} - Error\n${error.message}`)
    .setColor('DARK_RED');
    c.send(e).catch(()=>{});
}
