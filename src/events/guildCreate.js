/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');
const { guildPreset } = require('../database/presets');

exports.run = async (client, guild) => {
    if (!client.guilds.cache.has(guild.id)) {
        const e = new MessageEmbed()
        .setDescription(`<:checkgreen:796925441771438080> Joined **${guild.name}** - Active in ${client.guilds.cache.size} Servers!`)
        .setColor(0x00d134)
        .setTimestamp();
        client.channels.cache.get(client.config.logs.joins)?.send(e).catch(()=>{});
    }
    console.log(`\nMONGO | Guild Added: ${guild.name} (${guild.id})`);
    await client.db('guild').create(guildPreset(guild.id));
    await client.db('muted').create({ guildID: guild.id });
    await client.db('warns').create({ guildID: guild.id });
}
