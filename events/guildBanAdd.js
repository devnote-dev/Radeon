const { MessageEmbed } = require('discord.js');
const Guild = require('../schemas/guild-schema');

exports.run = async (client, guild, user) => {
    const db = await Guild.findOne({ guildID: guild.id });
    const { modLogs } = db;
    if (!modLogs.channel || !modLogs.bans) return;
    const info = await guild.fetchBan(user);
    let mod = 'Unknown';
    if (/^.+#\d{4}:/gi.test(info.reason)) mod = reason.split(' ').shift().replace(':','');
    const embed = new MessageEmbed()
    .setTitle('Member Banned')
    .setThumbnail(user.displayAvatarURL({dynamic: true}))
    .addFields(
        {name: 'User', value: `• ${user.tag}\n• ${user.id}`, inline: true},
        {name: 'Moderator', value: mod, inline: true},
        {name: 'Reason', value: info.reason ? info.reason.replace(/^.+#\d{4}:/gi,'') : '(No Reason Specified)', inline: false}
    )
    .setColor('RED')
    .setTimestamp();
    const c = guild.channels.cache.get(modLogs.channel);
    if (c) c.send(embed).catch(()=>{});
}
