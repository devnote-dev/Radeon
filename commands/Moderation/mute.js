const { MessageEmbed } = require('discord.js');
const ms = require('ms');
const Guild = require('../../schemas/guild-schema');
const Muted = require('../../schemas/muted-schema');

module.exports = {
    name: 'mute',
    tag: 'Mutes a specified user for a certain time',
    description: 'Mutes a specified user for a certain time.',
    usage: 'mute <User:Mention/ID> [Time:Duration] <Reason:Text>',
    permissions: 8192,
    guildOnly: true,
    run: async (client, message, args) => { 
        const { muteRole, modLogs } = await Guild.findOne({guildID: message.guild.id});
        if (!muteRole) return client.errEmb('Mute role not found/set. You can set one using the `muterole` command.', message);
        if (args.length < 2) return client.errEmb('Insufficient Arguments.\n```\nmute <User:Mention/ID> [Time:Duration] <Reason:Text>\n```', message);
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let duration = ms(args[1]);
        if (isNaN(duration) || duration > 31557600000) duration = 'inf';
        let reason = args.slice(2).join(' ');
        if (!target) return client.errEmb(`\`${args[0]}\` is not a valid member.`, message);
        if (target.user.id === message.author.id) return client.errEmb('You cant mute yourself. <:meguface:738862132493287474>', message);
        if (!reason) reason = '(No Reason Specified)';
        if (target.permissions.has('ADMINISTRATOR')) return client.errEmb('Unable to Mute: That user is an Administrator.', message);
        if (message.guild.me.roles.highest.comparePositionTo(muteRole) <= 0) return client.errEmb('Unable to Mute: Cannot Manage Roles Higher or Equal to Radeon', message);
        try {
            await target.roles.add(muteRole);
            const dmEmb = new MessageEmbed()
            .setTitle('You have been Muted!')
            .addField('Reason', reason, false).addField('Duration', `${ms(duration, {long: true})}`, false)
            .setColor(0x1e143b).setFooter(`Sent from ${message.guild.name}`, message.guild.iconURL({dynamic: true}))
            .setTimestamp();
            target.user.send(dmEmb).catch(()=>{});
            client.checkEmb(`\`${target.user.tag}\` was muted!`, message);
            await Muted.findOneAndUpdate(
                { guildID: message.guild.id },
                { $addToSet:{ mutedList: target.user.id }},
                { new: true }
            );
            if (modLogs.channel) {
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
                message.guild.channels.cache.get(modLogs.channel).send(embed).catch(()=>{});
            }
            if (duration === 'inf') return;
            setTimeout(async () => {
                await Muted.findOneAndUpdate(
                    { guildID: message.guild.id },
                    { $pull: { mutedList: target.user.id }},
                    { new: true }
                )
                await target.roles.remove(muteRole)
                if (modLogs.channel) {
                    const embed = new MessageEmbed()
                    .setTitle('Member Unmuted')
                    .setThumbnail(target.user.displayAvatarURL({dynamic: true}))
                    .addFields(
                        {name: 'User', value: `• ${target.user.tag}\n• ${target.user.id}`, inline: true},
                        {name: 'Moderator', value: `• ${client.user.tag}\n• ${client.user.id}`, inline: true},
                        {name: 'Reason', value: 'Auto: Mute Expired', inline: false}
                    )
                    .setColor('BLUE').setTimestamp();
                    return message.guild.channels.cache.get(modLogs.channel).send(embed).catch(()=>{});
                }
            }, duration);
        } catch (err) {
            console.error(err.message);
            return client.errEmb(`Unknown: Failed Muting Member \`${target.user.tag}\``, message);
        }
    }
}
