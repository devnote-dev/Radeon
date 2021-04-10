require('discord.js');
const { botReady } = require('../console/consoleR');

exports.run = async client => {
    botReady(client);
    client.user.setPresence({
        status: 'online',
        activity:{
            name: '@Radeon help',
            type: 'WATCHING'
        }
    });
    client.stats.events++;
    const { guilds, users } = client.config.logs;
    if (client.channels.cache.has(guilds)) client.channels.cache.get(guilds).setName(`│🌐» ${client.guilds.cache.size}`).catch(()=>{});
    if (client.channels.cache.has(users)) client.channels.cache.get(users).setName(`│👥» ${client.users.cache.size}`).catch(()=>{});
}
