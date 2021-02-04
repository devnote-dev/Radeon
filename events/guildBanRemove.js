const {MessageEmbed} = require('discord.js');
const Guild = require('../schemas/guild-schema');

exports.run = async (client, guild, user) => {
    const {modLogs} = await Guild.findOne({guildID: guild.id});
    if (!modLogs.channel || !modLogs.bans) return;
    const entry = await guild.fetchAuditLogs({limit:1, user:user, type:'MEMBER_BAN_REMOVE'}).then(l => l.entries.first());
    const {executor, reason} = entry;
    const embed = new MessageEmbed()
    .setTitle('Member Unbanned')
    .setThumbnail(user.displayAvatarURL({dynamic: true}))
    .addFields(
        {name: 'User', value: `• ${user.tag}\n• ${user.id}`, inline: true},
        {name: 'Moderator', value: executor.tag, inline: true},
        {name: 'Reason', value: reason || '(No Reason Specified)', inline: false}
    )
    .setColor('GREEN')
    .setTimestamp();
    guild.channels.cache.get(modLogs.channel).send(embed);
}
