/**
 * @author Piter <https://github.com/piterxyz>
 * @author Devonte <https://github.com/devnote-dev>
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @copyright Radeon Development 2021-2022
 */

const { Client, Collection, Intents:{ FLAGS }} = require('discord.js');
const { token } = require('../config.json');
const Logger = require('./log');

const client = new Client({
    intents:[
        FLAGS.GUILDS,
        FLAGS.GUILD_BANS,
        FLAGS.GUILD_MEMBERS
    ],
    partials:[
        'GUILD_MEMBER',
        'CHANNEL',
        'USER'
    ],
    allowedMentions:{
        repliedUser: true
    }
});

client.commands = new Collection();
client.db       = require('./database/manager');
client.logger   = new Logger();

Promise.all([
    require('./handler')(client),
    require('./mongo')(client),
    client.login(token)
]);
