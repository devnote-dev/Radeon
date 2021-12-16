/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */

const log = require('../log');
const { logs } = require('../config.json');

module.exports = async (client, guild) => {
    if (!client.guilds.cache.has(guild.id)) {
        log.info(`Left server: ${guild.name} (${guild.id})`);
        if (chan = client.channels.cache.get(logs.joins)) client.error(`Left server: **${guild.name}**`, chan);
    }

    await client.db('guild').delete(guild.id);
    await client.db('automod').delete(guild.id);
    await client.db('schedules').delete(guild.id);
    await client.db('warns').delete(guild.id);
}
