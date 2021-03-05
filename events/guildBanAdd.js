const { MessageEmbed } = require('discord.js');
const Guild = require('../schemas/guild-schema');

exports.run = async (client, guild, user) => {
    const { modLogs } = await Guild.findOne({guildID: guild.id});
    if (!modLogs.channel || !modLogs.bans) return;
    const { reason } = await guild.fetchBan(user);
    let mod = 'Unknown';
    if (/^.+#\d{4}:/gi.test(reason)) mod = reason.split(' ').shift().replace(':','');
    const embed = new MessageEmbed()
    .setTitle('Member Banned')
    .setThumbnail(user.displayAvatarURL({dynamic: true}))
    .addFields(
        {name: 'User', value: `• ${user.tag}\n• ${user.id}`, inline: true},
        {name: 'Moderator', value: mod, inline: true},
        {name: 'Reason', value: reason ? reason.replace(/^.+#\d{4}:/gi,'') : '(No Reason Specified)', inline: false}
    )
    .setColor('RED')
    .setTimestamp();
    guild.channels.cache.get(modLogs.channel).send(embed).catch(()=>{});
}
