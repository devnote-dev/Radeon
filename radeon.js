const Discord = require('discord.js');
const client = new Discord.Client();
const {readdirSync} = require('fs');

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.config = require('./config.json');

readdirSync('./handlers/').forEach(handler => {
    if (!handler.endsWith('.handler.js')) return;
    require(`./handlers/${handler}`)(client);
});

client.login(client.config.token);