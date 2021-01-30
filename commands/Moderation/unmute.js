require('discord.js');
const Guild = require('../../schemas/guild-schema');

module.exports = {
    name: 'unmute',
    description: 'Unmutes a muted user.',
    usage: 'unmute <User:Mention/ID>',
    guildOnly: true,
    permissions: ['MANAGE_MESSAGES'],
    run: async (client, message, args) => {
        const {muteRole} = await Guild.findOne({guildID: message.guild.id});
        if (!muteRole) return message.channel.send(client.errEmb('Mute role not found/set. You can set one using the `muterole` command.'));
        if (args.length < 1) return message.channel.send(client.errEmb('Insufficient Arguments.\n```\nunmute <User:Mention/ID>\n```'));
        const target = message.mentions.members.first() || message.guild.member(args[0]);
        if (!target) return message.channel.send(client.errEmb(`\`${args[0]}\` is not a valid member.`));
        if (!target.roles.cache.has(muteRole)) return message.channel.send(client.errEmb(`\`${target.user.tag}\` is not muted.`));
        try {
            await target.roles.remove(muteRole);
            target.user.send({embed:{title:'You have been Unmuted!',color:0x1e143b,footer:{text:`Sent from ${message.guild.name}`, icon_url:message.guild.iconURL({dynamic:true})}}}).catch(()=>{});
            message.channel.send(client.successEmb(`\`${target.user.tag}\` was unmuted!`));
        } catch (err) {
            message.channel.send(client.errEmb(`Unknown: Failed Unmuting Member \`${target.user.tag}\``));
        }
    }
}
