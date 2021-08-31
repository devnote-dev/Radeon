/**
 * @author Piter <https://github.com/piterxyz>
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { botReady } = require('../dist/console');

exports.run = async client => {
    botReady(client);
    await client.user.setPresence({
        status: 'online',
        activities:[{
            name: 'Commands',
            type: 'LISTENING'
        }]
    });
    client.stats.events++;
    const { guilds } = client.config.logs;
    if (client.channels.cache.has(guilds)) client.channels.cache.get(guilds)?.setName(`│🌐» ${client.guilds.cache.size}`).catch(()=>{});
}
