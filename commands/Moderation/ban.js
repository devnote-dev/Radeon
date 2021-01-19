require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Bans a member from the server. `-dd <number>` flag is for the number of days the user\'s messages should be deleted (max 7).',
    usage: 'ban <User:Mention/ID> <Reason:text> [-dd <number>]',
    guildOnly: true,
    permissions: ['BAN_MEMBERS'],
    run: async (client, message, args) => {
        if (args.length < 1) return message.channel.send(client.errEmb('No User Specified.\n```\nkick <User:Mention/ID> <Reason:text> [-dd <number>]\n```'));
        const target = message.mentions.users.first() || client.users.cache.get(args[0]);
        if (message.author.id === target.id) return message.channel.send(client.errEmb('You can\'t ban yourself.'));
        if (args.length < 2) return message.channel.send(client.errEmb('A reason is required for this command.'));
        let reason = args.slice(1).join(' ');
        let ddays = 0;
        if (/-dd\s+\d$/gi.test(reason)) {
            ddays = parseInt(/\d$/g.exec(reason)[0]);
            reason = reason.replace(/-dd\s+\d$/gi, '');
        }
        if (isNaN(ddays) || ddays < 0 || ddays > 7) ddays = 0;
        if (target.bannable) return message.channel.send(client.errEmb(`User \`${target.tag}\` could not be banned.`));
        try {
            await target.send({embed:{title:'You have been Banned!',description:`**Reason:** ${reason}`,color:0x1e143b,footer:{text:`Sent from ${message.guild.name}`, icon_url:message.guild.iconURL({dynamic:true})}}}).catch(()=>{});
            message.guild.members.ban(target.id,{days:ddays, reason:reason});
            return message.channel.send(client.successEmb(`Successfully Banned \`${target.tag}\`!`));
        } catch (err) {
            return message.channel.send(client.errEmb(`Unknown: Failed Banning Member \`${target.tag}\``));
        }
    }
}
