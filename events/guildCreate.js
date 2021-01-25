const {MessageEmbed} = require('discord.js');
const Guild = require('../schemas/guild-schema');

exports.run = async (client, guild) => {
    const e = new MessageEmbed()
    .setDescription(`<:checkgreen:796925441771438080> Joined **${guild.name}** - Active in ${client.guilds.cache.size} Servers!`)
    .setColor(0x00d134)
    .setTimestamp();
    client.channels.cache.get(client.config.logs.guilds).send(e);
    
        newGuild = new Guild({
            guildID: guild.id,
            prefix: client.config.prefix,
            modLogs: '',
            muteRole: '',
            ignoredChannels: [],
            ignoredCommands: []
        });
        newGuild.save();
        console.log(`Mongoose | Guild Added: ${guild.name}`);
    }
