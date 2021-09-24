/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');
const presets = require('../database/presets');
const { logs } = require('../../config.json');

exports.run = async (client, guild) => {
    if (!client.guilds.cache.has(guild.id)) {
        const e = new MessageEmbed()
            .setDescription(`<:checkgreen:796925441771438080> Joined **${guild.name}** - Active in ${client.guilds.cache.size} Servers!`)
            .setColor(0x00d134)
            .setTimestamp();
        client.channels.cache.get(logs.joins)?.send({ embeds:[e] }).catch(()=>{});
    }
    console.log(`\nMONGO | Guild Added: ${guild.name} (${guild.id})`);
    await client.db('guild').create(presets.guild(guild.id));
    await client.db('automod').create(presets.automod(guild.id));
    await client.db('muted').create(presets.muted(guild.id));
    await client.db('warns').create(presets.warns(guild.id));
}
