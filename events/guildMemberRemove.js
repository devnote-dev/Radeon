const { MessageEmbed } = require('discord.js');
const Guild = require('../schemas/guild-schema');

exports.run = async (client, member) => {
    const db = await Guild.findOne({ guildID: member.guild.id });
    const { modLogs } = db;
    if (!modLogs.channel && !modLogs.kicks) return;
    let count = 0;
    let audit;
    while (!audit) {
        audit = await member.guild.fetchAuditLogs({ type: 'MEMBER_KICK', limit: 3 });
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
        .setTitle('Member Kicked')
        .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
        .addFields(
            {name: 'User', value: `• ${member.user.tag}\n• ${member.user.id}`, inline: true},
            {name: 'Moderator', value: `• ${executor.tag}\n• ${executor.id}`, inline: true},
            {name: 'Reason', value: reason || '(No Reason Specified)', inline: false}
        )
        .setColor('GREY')
        .setTimestamp();
        const c = member.guild.channels.cache.get(modLogs.channel);
        if (c) c.send(embed).catch(()=>{});
    }
}
