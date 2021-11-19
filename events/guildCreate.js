/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */

const log = require('../log');
const presets = require('../database/presets');
const { logs } = require('../config.json');

module.exports = async (client, guild) => {
    if (!client.guilds.cache.has(guild.id)) {
        log.info(`Joined server: ${guild.name} (${guild.id})`);
        if (chan = client.channels.cache.get(logs.joins)) client.check(`Joined server: **${guild.name}**`, chan);
    }

    await client.db('guild').create(presets.newGuild(guild.id));
    await client.db('automod').create(presets.newAutomod(guild.id));
    await client.db('schedules').create(presets.newSchedules(guild.id));
    await client.db('warns').create(presets.newWarns(guild.id));
}
