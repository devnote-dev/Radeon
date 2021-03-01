const {MessageEmbed} = require('discord.js');
const Guild = require('../../schemas/guild-schema');
const Muted = require('../../schemas/muted-schema');

module.exports = {
    name: 'unmute',
    description: 'Unmutes a muted user.',
    usage: 'unmute <User:Mention/ID> [Reason:Text]',
    guildOnly: true,
    permissions: 268435456,
    run: async (client, message, args) => {
        const {muteRole, modLogs} = await Guild.findOne({guildID: message.guild.id});
        if (!muteRole) return client.errEmb('Mute role not found/set. You can set one using the `muterole` command.', message);
        if (!args.length) return client.errEmb('Insufficient Arguments.\n```\nunmute <User:Mention/ID> [Reason:Text]\n```', message);
        const target = message.mentions.members.first() || message.guild.member(args[0]);
        if (!target) return client.errEmb(`\`${args[0]}\` is not a valid member.`, message);
        if (!target.roles.cache.has(muteRole)) return client.errEmb(`\`${target.user.tag}\` is not muted.`, message);
        let reason = '(No Reason Specified)';
        if (args.length > 1) reason = args.slice(1).join(' ');
        try {
            await Muted.findOneAndUpdate(
                { guildID: message.guild.id },
                { $pullAll: target.user.id }
            );
            await target.roles.remove(muteRole);
            target.user.send({embed:{title:'You have been Unmuted!',description:`**Reason:** ${reason}`,color:0x1e143b,footer:{text:`Sent from ${message.guild.name}`, icon_url:message.guild.iconURL({dynamic:true})}}}).catch(()=>{});
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
                message.guild.channels.cache.get(modLogs.channel).send(embed).catch(()=>{});
            }
        } catch (err) {
            console.log(err);
            client.errEmb(`Unknown: Failed Unmuting Member \`${target.user.tag}\``, message);
        }
    }
}
