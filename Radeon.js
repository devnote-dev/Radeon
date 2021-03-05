const Discord = require('discord.js');
const client = new Discord.Client({
    ws:{
        intents:[
            'DIRECT_MESSAGES',
            'GUILDS',
            'GUILD_BANS',
            'GUILD_EMOJIS',
            'GUILD_INVITES',
            'GUILD_MEMBERS',
            'GUILD_MESSAGES',
            'GUILD_PRESENCES',
        ]
    },
    partials:[
        'CHANNEL',
        'GUILD_MEMBER',
        'MESSAGE',
        'USER'
    ],
    allowedMentions:{
        parse:['users']
    }
});
const { readdirSync } = require('fs');

client.commands  = new Discord.Collection();
client.aliases   = new Discord.Collection();
client.cmdlogs   = new Set();
client.cooldowns = new Map();
client.rlcount   = 0;
client.config    = require('./config.json');
client.mongoose  = require('./mongo');

readdirSync('./handlers/').forEach(handler => {
    if (!handler.endsWith('.handler.js')) return;
    require(`./handlers/${handler}`)(client);
});

setInterval(() => { client.rlcount = 0 }, 600000);

client.mongoose.init();
client.login(client.config.token);
