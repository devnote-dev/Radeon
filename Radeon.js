const { Client, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const client = new Client({
    ws:{
        intents:[
            'DIRECT_MESSAGES',
            'GUILDS',
            'GUILD_BANS',
            'GUILD_EMOJIS',
            'GUILD_INVITES',
            'GUILD_MEMBERS',
            'GUILD_MESSAGES',
            'GUILD_PRESENCES'
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

client.commands   = new Collection();
client.aliases    = new Collection();
client.ratelimits = new Collection();
client.cmdlogs    = new Set();
client.cooldowns  = new Map();
client.config     = require('./config.json');
client.mongoose   = require('./mongo');
client.rlcount    = 0;
client.stats      = {
    events:     0,
    commands:   0,
    messages:   0,
    background: 0,
    _events:    0,
    _failed:    []
};

readdirSync('./handlers/').forEach(handler => {
    if (!handler.endsWith('.handler.js')) return;
    require(`./handlers/${handler}`)(client);
});

setInterval(() => { client.rlcount = 0 }, 600000);

client.mongoose.init();
client.login(client.config.token);
