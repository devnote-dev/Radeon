const Discord = require('discord.js');
const client = new Discord.Client();
const {readdirSync} = require('fs');

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.config = require('./config.json');
client.mongoose = require('./mongo');

readdirSync('./handlers/').forEach(handler => {
    if (!handler.endsWith('.handler.js')) return;
    require(`./handlers/${handler}`)(client);
});

client.mongoose.init();
client.login(client.config.token);
