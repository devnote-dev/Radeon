/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @author Piter <https://github.com/piterxyz>
 * @copyright 2021 Radeon Development
 */

const { token } = require('./config.json');
const { Client, Intents:{ FLAGS }} = require('discord.js');
// const { readdirSync } = require('fs');

const client = new Client({
    intents:[
        FLAGS.GUILDS,
        FLAGS.GUILD_BANS,
        FLAGS.GUILD_MEMBERS,
        FLAGS.GUILD_MESSAGES,
        FLAGS.GUILD_WEBHOOKS
    ],
    partials:[
        'GUILD_MEMBER',
        'CHANNEL',
        'MESSAGE',
        'USER'
    ],
    allowedMentions:{
        parse:['users'],
        repliedUser: true
    }
});

client.commands = new Map();
client.aliases = new Map();
client.cooldowns = new Map();
client.hooks = new Map();

// TODO:
// - client stats module
// - client db module

require('./handler')(client);
client.login(token);
