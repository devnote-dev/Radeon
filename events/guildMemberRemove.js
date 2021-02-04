const {MessageEmbed} = require('discord.js');
const Guild = require('../schemas/guild-schema');

exports.run = async (client, member) => {
    const {modLogs} = await Guild.findOne({guildID: member.guild.id});
    if (!modLogs.channel || !modLogs.kicks) return;
    const entry = await guild.fetchAuditLogs({limit:1, user:member.user, type:'MEMBER_KICK'}).then(l => l.entries.first());
    const {executor, reason} = entry;
    const embed = new MessageEmbed()
    .setTitle('Member Kicked')
    .setThumbnail(user.displayAvatarURL({dynamic: true}))
    .addFields(
        {name: 'User', value: `• ${member.user.tag}\n• ${member.user.id}`, inline: true},
        {name: 'Moderator', value: executor.tag, inline: true},
        {name: 'Reason', value: reason || '(No Reason Specified)', inline: false}
    )
    .setColor('GREY')
    .setTimestamp();
    guild.channels.cache.get(modLogs.channel).send(embed);
}
