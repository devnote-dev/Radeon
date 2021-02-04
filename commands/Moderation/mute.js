const {MessageEmbed} = require('discord.js');
const ms = require('ms');
const Guild = require('../../schemas/guild-schema');
const Muted = require('../../schemas/muted-schema');

module.exports = {
    name: 'mute',
    description: 'Mutes a specified user for a certain time.',
    usage: 'mute <User:Mention/ID> <Time:duration> [Reason:text]',
    guildOnly: true,
    permissions: ["MANAGE_MESSAGES"],
    run: async (client, message, args) => { 
        const {muteRole, modLogs} = await Guild.findOne({guildID: message.guild.id});
        if (!muteRole) return client.errEmb('Mute role not found/set. You can set one using the `muterole` command.', message);
        if (args.length < 2) return client.errEmb('Insufficient Arguments.\n```\nmute <User:Mention/ID> <Time:duration> [Reason:text]\n```', message);
        const target = message.mentions.members.first() || message.guild.member(args[0]);
        let duration = ms(args[1]);
        if (duration > 31557600000) duration = 'inf';
        let reason = args.slice(2).join(' ');
        if (!target) return client.errEmb(`\`${args[0]}\` is not a valid member.`, message);
        if (target.user.id === message.author.id) return client.errEmb('You cant mute yourself. <:wtf_dude:789567331495968818>', message);
        if (isNaN(duration) && duration != 'inf') return client.errEmb(`Invalid duration format: \`${args[1]}\``, message);
        if (!reason) reason = '(No Reason Specified)';
        if (target.permissions.has('ADMINISTRATOR')) return client.errEmb('Unable to Mute: That user is an Administrator.', message);
        const radeon = message.guild.member(client.user.id);
        if (!radeon.permissions.has('MANAGE_ROLES')) return client.errEmb('Unable to Mute: Missing Permission `MANAGE ROLES`', message);
        if (radeon.roles.highest.position <= target.roles.highest.position) return client.errEmb('Unable to Mute: That user\'s role is above mine.', message);
        try {
            await target.roles.add(muteRole);
            target.user.send({embed:{title:'You have been Muted!',description:`**Reason:** ${reason}\n**Duration:** ${ms(duration, {long:true})}`,color:0x1e143b,footer:{text:`Sent from ${message.guild.name}`, icon_url:message.guild.iconURL({dynamic:true})}}}).catch(()=>{});
            client.checkEmb(`\`${target.user.tag}\` was muted!`, message);
            await Muted.findOneAndUpdate(
                { guildID: message.guild.id },
                { $addToSet:{ mutedList: target.user.id }},
                { new: true }
            );
            if (modLogs) {
                const embed = new MessageEmbed()
                .setTitle('Member Muted')
                .setThumbnail(target.user.displayAvatarURL({dynamic: true}))
                .addFields(
                    {name: 'User', value: `• ${target.user.tag}\n• ${target.user.id}`, inline: true},
                    {name: 'Moderator', value: `• ${message.author.tag}\n• ${message.author.id}`, inline: true},
                    {name: 'Reason', value: reason, inline: false}
                )
                .setFooter(`Duration: ${ms(duration, {long: true})}`)
                .setColor('GREY').setTimestamp();
                message.guild.channels.cache.get(modLogs).send(embed).catch(()=>{});
            }
            if (duration === 'inf') return;
            setTimeout(async () => {
                await target.roles.remove(muteRole)
                await Muted.findOneAndUpdate(
                    { guildID: message.guild.id },
                    { $pull: target.user.id }
                )
                if (modLogs) {
                    const embed = new MessageEmbed()
                    .setTitle('Member Unmuted')
                    .setThumbnail(target.user.displayAvatarURL({dynamic: true}))
                    .addFields(
                        {name: 'User', value: `• ${target.user.tag}\n• ${target.user.id}`, inline: true},
                        {name: 'Moderator', value: `• ${client.user.tag}\n• ${client.user.id}`, inline: true},
                        {name: 'Reason', value: 'Auto: Mute Expired', inline: false}
                    )
                    .setColor('BLUE').setTimestamp();
                    message.guild.channels.cache.get(modLogs).send(embed).catch(()=>{});
                }
            }, duration);
        } catch (err) {
            client.errEmb(`Unknown: Failed Muting Member \`${target.user.tag}\``, message);
        }
    }
}
