/**
 * @author Devonte <https://github.com/devnote-dev>
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');
const { logError } = require('../../dist/console');
const { resolveMember } = require('../../functions');
const ms = require('ms');

module.exports = {
    name: 'mute',
    tag: 'Mutes a specified user for a certain time',
    description: 'Mutes a specified user for a certain time.',
    usage: 'mute <User:Mention/ID> [Time:Duration] <Reason:Text>',
    userPerms: 8192n,
    botPerms: 268435456n,
    guildOnly: true,
    roleBypass: true,
    async run(client, message, args) {
        const data = await client.db('guild').get(message.guild.id);
        if (!data) return client.errEmb('Unknown: Failed Connecting To Server Database. Try contacting support.', message);
        const { muteRole, modLogs } = data;
        if (!muteRole) return client.errEmb('Mute role not found/set. You can set one using the `muterole` command.', message);
        if (args.length < 2) return client.errEmb('Insufficient Arguments.\n```\nmute <User:Mention/ID> [Time:Duration] <Reason:Text>\n```', message);
        const target = message.mentions.members.first() || await resolveMember(message, args.raw);
        if (!target) return client.errEmb('User is not a member of the server.', message);
        let duration = ms(args.raw[1]);
        if (isNaN(duration) || duration > 31557600000) duration = 'inf';
        let reason = args.raw.slice(2).join(' ');
        if (target.user.id === message.author.id) return client.errEmb('You cant mute yourself.', message);
        if (target.user.id === client.user.id) return client.errEmb('I can\'t mute myself.', message);
        if (!reason) reason = '(No Reason Specified)';
        if (target.permissions.has(8n)) return client.errEmb('Unable to Mute: That user is an administrator.', message);
        if (message.guild.me.roles.highest.comparePositionTo(muteRole) <= 0) return client.errEmb('Unable to Mute: Cannot manage roles higher or equal to Radeon.', message);
        try {
            const mData = await client.db('muted').get(message.guild.id);
            if (duration != 'inf') {
                mData.mutedList.set(target.user.id, Date.now() + duration);
            } else {
                mData.mutedList.set(target.user.id, null);
            }
            await client.db('muted').update(message.guild.id, { mutedList: mData.mutedList });
            await target.roles.add(muteRole);
            const dmEmb = new MessageEmbed()
                .setTitle('You have been Muted!')
                .addField('Reason', reason, false)
                .addField('Duration', `${ms(duration, { long: true })}`, false)
                .setColor(0x1e143b)
                .setFooter(`Sent from ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
                .setTimestamp();
            target.user.send({ embeds:[dmEmb] }).catch(()=>{});
            client.checkEmb(`\`${target.user.tag}\` was muted!`, message);
            if (modLogs.channel) {
                const embed = new MessageEmbed()
                    .setTitle('Member Muted')
                    .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        {name: 'User', value: `• ${target.user.tag}\n• ${target.user.id}`, inline: true},
                        {name: 'Moderator', value: `• ${message.author.tag}\n• ${message.author.id}`, inline: true},
                        {name: 'Reason', value: reason, inline: false}
                    )
                    .setFooter(`Duration: ${ms(duration, { long: true })}`)
                    .setColor('GREY')
                    .setTimestamp();
                message.guild.channels.cache.get(modLogs.channel)?.send({ embeds:[embed] }).catch(()=>{});
            }
        } catch (err) {
            logError(err, `${message.guild.id}/${message.channel.id}`);
            return client.errEmb(`Unknown: Failed muting member \`${target.user.tag}\``, message);
        }
    }
}
