require('discord.js');

exports.run = async client => {
    console.log('\x1b[36mRadeon is Ready!\x1b[0m');
    client.user.setPresence({
        status: 'online',
        activity:{
            name: 'with logging!',
            type: 'PLAYING'
        }
    });
    const {guilds, users} = client.config.logs;
    if (!guilds) return;
    client.channels.cache.get(guilds).setName(`│🌐» ${client.guilds.cache.size}`).catch(()=>{});
    if (!users) return;
    client.channels.cache.get(users).setName(`│👥» ${client.users.cache.size}`).catch(()=>{});
}
