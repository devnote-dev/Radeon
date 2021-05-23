/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');
const Guild = require('../schemas/guild-schema');
const Muted = require('../schemas/muted-schema');
const Warns = require('../schemas/warn-schema');

exports.run = async (client, guild) => {
    const e = new MessageEmbed()
    .setDescription(`<:checkgreen:796925441771438080> Joined **${guild.name}** - Active in ${client.guilds.cache.size} Servers!`)
    .setColor(0x00d134)
    .setTimestamp();
    client.channels.cache.get(client.config.logs.joins).send(e).catch(()=>{});
    await new Guild({
        guildID: guild.id,
        prefix: client.config.prefix,
        modLogs:{channel:''},
        muteRole: '',
        everyoneRole: '',
        ignoredChannels: [],
        ignoredCommands: [],
        automod:{
            active:false,
            channel:'',
            invites:false,
            rateLimit:false,
            massMention:{active:false},
            badWords:{active:false}
        }
    }).save();
    console.log(`MONGO | Guild Added: ${guild.name}`);
    await new Muted({ guildID: guild.id }).save();
    await new Warns({ guildID: guild.id }).save();
}
