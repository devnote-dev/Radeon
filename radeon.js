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

client.successEmb = (msg) => {
    const e = new Discord.MessageEmbed()
    .setDescription('<:checkgreen:796925441771438080> '+ msg)
    .setColor(0x00d134);
    return e;
}

client.errEmb = (msg) => {
    const e = new Discord.MessageEmbed()
    .setDescription('<:crossred:796925441490681889> '+ msg)
    .setColor(0xd10000);
    return e;
}

process.on('unhandledRejection', error => {
    console.error('Unhandled Promise Rejection:', error);
});

client.login(client.config.token);
