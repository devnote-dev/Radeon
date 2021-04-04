const { MessageEmbed } = require('discord.js');
const Guild = require('../../schemas/guild-schema');
const Muted = require('../../schemas/muted-schema');

module.exports = {
    name: 'unmute',
    tag: 'Unmutes a muted user',
    description: 'Unmutes a muted user.',
    usage: 'unmute <User:Mention/ID> [Reason:Text]',
    userPerms: 8192,
    botPerms: 268435456,
    guildOnly: true,
    run: async (client, message, args) => {
        const { muteRole, modLogs } = await Guild.findOne({guildID: message.guild.id});
        if (!muteRole) return client.errEmb('Mute role not found/set. You can set one using the `muterole` command.', message);
        if (!args.length) return client.errEmb('Insufficient Arguments.\n```\nunmute <User:Mention/ID> [Reason:Text]\n```', message);
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) return client.errEmb(`\`${args[0]}\` is not a valid member.`, message);
        if (!target.roles.cache.has(muteRole)) return client.errEmb(`\`${target.user.tag}\` is not muted.`, message);
        let reason = '(No Reason Specified)';
        if (args.length > 1) reason = args.slice(1).join(' ');
        try {
            await Muted.findOneAndUpdate(
                { guildID: message.guild.id },
                { $pull:{ mutedList: target.user.id }},
                { new: true }
            );
            await target.roles.remove(muteRole);
            const dmEmb = new MessageEmbed()
            .setTitle('You have been Unmuted!')
            .addField('Reason', reason, false)
            .setColor(0x1e143b).setFooter(`Sent from ${message.guild.name}`, message.guild.iconURL({dynamic: true}))
            .setTimestamp();
            target.user.send(dmEmb).catch(()=>{});
            client.checkEmb(`\`${target.user.tag}\` was unmuted!`, message);
            if (modLogs.channel) {
                const embed = new MessageEmbed()
                .setTitle('Member Unmuted')
                .setThumbnail(target.user.displayAvatarURL({dynamic: true}))
                .addFields(
                    {name: 'User', value: `• ${target.user.tag}\n• ${target.user.id}`, inline: true},
                    {name: 'Moderator', value: `• ${message.author.tag}\n• ${message.author.id}`, inline: true},
                    {name: 'Reason', value: reason, inline: false}
                )
                .setColor('BLUE').setTimestamp();
                return message.guild.channels.cache.get(modLogs.channel).send(embed).catch(()=>{});
            }
        } catch (err) {
            console.log(err);
            return client.errEmb(`Unknown: Failed Unmuting Member \`${target.user.tag}\``, message);
        }
    }
}
