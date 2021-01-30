require('discord.js');
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
        const {muteRole} = await Guild.findOne({guildID: message.guild.id});
        if (!muteRole) return message.channel.send(client.errEmb('Mute role not found/set. You can set one using the `muterole` command.'));
        if (args.length < 2) return message.channel.send(client.errEmb('Insufficient Arguments.\n```\nmute <User:Mention/ID> <Time:duration> <Reason:text>\n```'));
        const target = message.mentions.members.first() || message.guild.member(args[0]);
        let duration = ms(args[1]);
        if (duration > 31557600000) duration = 'inf';
        let reason = args.slice(2).join(' ');
        if (!target) return message.channel.send(client.errEmb(`\`${args[0]}\` is not a valid member.`));
        if (target.user.id === message.author.id) return message.channel.send(client.errEmb('You cant mute yourself. <:wtf_dude:789567331495968818>'));
        if (isNaN(duration) && duration != 'inf') return message.channel.send(client.errEmb(`Invalid duration format: \`${args[1]}\``));
        if (!reason) reason = '(No Reason Specified)';
        if (target.permissions.has('ADMINISTRATOR')) return message.channel.send(client.errEmb('Unable to Mute. That user is an Administrator.'));
        const ra = message.guild.member(client.user.id).roles.highest;
        if (ra.position <= target.roles.highest.position) return message.channel.send(client.errEmb('Unable to Mute. That user\'s role is above mine.'));
        try {
            await target.roles.add(muteRole);
            target.user.send({embed:{title:'You have been Muted!',description:`**Reason:** ${reason}\n**Duration:** ${ms(duration, {long:true})}`,color:0x1e143b,footer:{text:`Sent from ${message.guild.name}`, icon_url:message.guild.iconURL({dynamic:true})}}}).catch(()=>{});
            message.channel.send(client.successEmb(`\`${target.user.tag}\` was muted!`));
            await Muted.findOneAndUpdate(
                { guildID: message.guild.id },
                { $set:{ mutedList: target.user.id }},
                { new: true }
            );
            if (duration === 'inf') return;
            setTimeout(() => {
                target.roles.remove(muteRole)
            }, duration);
        } catch (err) {
            message.channel.send(client.errEmb(`Unknown: Failed Muting Member \`${target.user.tag}\``));
        }
    }
}
