/**
 * @author Piter <https://github.com/piterxyz>
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { logs } = require('../../config.json');
const log = require('../log');

exports.run = async client => {
    await log.ready(client);
    await client.user.setPresence({
        status: 'online',
        activities:[{
            name: 'Commands',
            type: 'LISTENING'
        }]
    });
    client.stats.events++;
    if (client.channels.cache.has(logs.guilds)) client.channels.cache.get(logs.guilds)
        ?.setName(`│🌐» ${client.guilds.cache.size}`)
        .catch(()=>{});
}
