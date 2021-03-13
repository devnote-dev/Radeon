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
    const { guilds, users } = client.config.logs;
    if (!guilds) return;
    client.channels.cache.get(guilds).setName(`│🌐» ${client.guilds.cache.size}`).catch(()=>{});
    if (!users) return;
    client.channels.cache.get(users).setName(`│👥» ${client.users.cache.size}`).catch(()=>{});
}
