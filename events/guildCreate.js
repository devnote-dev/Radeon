const {MessageEmbed} = require('discord.js');
const Guild = require('../schemas/guild-schema');
const Muted = require('../schemas/muted-schema');

exports.run = async (client, guild) => {
    const e = new MessageEmbed()
    .setDescription(`<:checkgreen:796925441771438080> Joined **${guild.name}** - Active in ${client.guilds.cache.size} Servers!`)
    .setColor(0x00d134)
    .setTimestamp();
    client.channels.cache.get(client.config.logs.guilds).send(e);
    let newGuild = new Guild({
        guildID: guild.id,
        prefix: client.config.prefix,
        modLogs:{channel: ''},
        muteRole: '',
        ignoredChannels: [],
        ignoredCommands: []
    });
    newGuild.save();
    console.log(`Mongoose | Guild Added: ${guild.name}`);
    const newList = new Muted({
        guildID: guild.id,
        mutedList: []
    });
    newList.save();
}
