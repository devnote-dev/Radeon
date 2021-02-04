require('discord.js');

exports.run = async client => {
    console.log('\x1b[36mRadeon is Ready!\x1b[0m');
    client.user.setPresence({
        status: 'online',
        activity:{
            name: `${client.guilds.cache.size} servers!`,
            type: 'WATCHING'
        }
    });
}
