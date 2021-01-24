const {MessageEmbed} = require('discord.js');
const Guild = require('../schemas/guild-schema');

exports.run = async (client, guild) => {
    const e = new MessageEmbed()
    .setDescription(`<:crossred:796925441490681889> Left **${guild.name}** - Active in ${client.guilds.cache.size} Servers!`)
    .setColor(0xd10000)
    .setTimestamp();
    client.channels.cache.get(client.config.logs.guilds).send(e);
    
    Guild.findOneAndDelete({guildID: guild.id}).catch(()=>{});
    console.log(`Mongoose | Guild Removed: ${guild.name}`);
}
