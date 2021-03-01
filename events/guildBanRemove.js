const {MessageEmbed} = require('discord.js');
const Guild = require('../schemas/guild-schema');

exports.run = async (client, guild, user) => {
    const {modLogs} = await Guild.findOne({guildID: guild.id});
    if (!modLogs.channel || !modLogs.bans) return;
    let entry = await guild.fetchAuditLogs({limit:1, user:user, type:'MEMBER_BAN_REMOVE'});
    entry = entry.entries.first();
    let executor, reason;
    if (entry) {
        executor = entry.executor;
        reason = entry.reason;
    }
    const embed = new MessageEmbed()
    .setTitle('Member Unbanned')
    .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
    .addFields(
        {name: 'User', value: `• ${member.user.tag}\n• ${member.user.id}`, inline: true},
        {name: 'Moderator', value: executor ? executor.tag : 'Unknown', inline: true},
        {name: 'Reason', value: reason ?? '(No Reason Specified)', inline: false}
    )
    .setColor('GREEN')
    .setTimestamp();
    guild.channels.cache.get(modLogs.channel).send(embed).catch(()=>{});
}
