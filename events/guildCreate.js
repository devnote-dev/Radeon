const {MessageEmbed} = require('discord.js');
const Guild = require('../schemas/guild-schema');

exports.run = async (client, guild) => {
    const e = new MessageEmbed()
    .setDescription(`<:checkgreen:796925441771438080> Joined **${guild.name}** - Active in ${client.guilds.cache.size} Servers!`)
    .setColor(0x00d134)
    .setTimestamp();
    client.channels.cache.get(client.config.logs.guilds).send(e);
    if (!Guild.findOne({guildID: guild.id})) {
        const newGuild = new Guild({
            guildID: guild.id,
            prefix: client.config.prefix,
            ignoredChannels: [],
            ignoredCommands: [],
        });
        newGuild.save();
        console.log(`Mongoose | Guild Added: ${guild.name}`);
    }
}
