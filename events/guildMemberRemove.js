const {MessageEmbed} = require('discord.js');
const Guild = require('../schemas/guild-schema');

exports.run = async (client, member) => {
    const {modLogs} = await Guild.findOne({guildID: member.guild.id});
    if (!modLogs.channel || !modLogs.kicks) return;
    let entry = await member.guild.fetchAuditLogs({user:member.user, type:'MEMBER_KICK'});
    entry = entry.entries.first();
    if (!entry) return;
    const {executor, reason} = entry;
    const embed = new MessageEmbed()
    .setTitle('Member Kicked')
    .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
    .addFields(
        {name: 'User', value: `• ${member.user.tag}\n• ${member.user.id}`, inline: true},
        {name: 'Moderator', value: executor, inline: true},
        {name: 'Reason', value: reason ?? '(No Reason Specified)', inline: false}
    )
    .setColor('GREY')
    .setTimestamp();
    client.channels.cache.get(modLogs.channel).send(embed).catch(()=>{});
}
