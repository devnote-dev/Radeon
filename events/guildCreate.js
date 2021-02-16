const {MessageEmbed} = require('discord.js');
const Guild = require('../schemas/guild-schema');
const Muted = require('../schemas/muted-schema');

exports.run = async (client, guild) => {
    const e = new MessageEmbed()
    .setDescription(`<:checkgreen:796925441771438080> Joined **${guild.name}** - Active in ${client.guilds.cache.size} Servers!`)
    .setColor(0x00d134)
    .setTimestamp();
    client.channels.cache.get(client.config.logs.joins).send(e).catch(()=>{});
    new Guild({
        guildID: guild.id,
        prefix: client.config.prefix,
        modLogs:{channel:''},
        muteRole: '',
        ignoredChannels: [],
        ignoredCommands: [],
        automod:{active:false, channel:'', invites:false, rateLimit:false, massMention:{active:false},badWords:{active:false}}
    }).save();
    console.log(`Mongoose | Guild Added: ${guild.name}`);
    new Muted({
        guildID: guild.id,
        mutedList: []
    }).save();
}
