const { MessageEmbed } = require('discord.js');
const Guild = require('../schemas/guild-schema');

exports.run = async (client, guild, user) => {
    const db = await Guild.findOne({ guildID: guild.id });
    const { modLogs } = db;
    if (!modLogs.channel && !modLogs.bans) return;
    let count = 0;
    let audit;
    while (!audit) {
        audit = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_REMOVE', limit: 3 });
        if (!audit) {
            count++;
            if (count == 3) break;
            setTimeout(() => {}, 3000);
        } else {
            audit = audit.entries.first();
            break;
        }
    }
    if (audit) {
        const { reason, executor } = audit;
        const embed = new MessageEmbed()
        .setTitle('Member Unbanned')
        .setThumbnail(user.displayAvatarURL({dynamic: true}))
        .addFields(
            {name: 'User', value: `• ${user.tag}\n• ${user.id}`, inline: true},
            {name: 'Moderator', value: `• ${executor.tag}\n• ${executor.id}`, inline: true},
            {name: 'Reason', value: reason || '(No Reason Specified)', inline: false}
        )
        .setColor('GREEN')
        .setTimestamp();
        const c = guild.channels.cache.get(modLogs.channel);
        if (c) c.send(embed).catch(()=>{});
    }
}
