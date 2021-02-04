require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Bans a member from the server. `-dd <number>` flag is for the number of days the user\'s messages should be deleted (max 7).',
    usage: 'ban <User:Mention/ID> <Reason:text> [-dd <number>]',
    guildOnly: true,
    permissions: ['BAN_MEMBERS'],
    run: async (client, message, args) => {
        if (args.length < 1) return client.errEmb('No User Specified.\n```\nban <User:Mention/ID> <Reason:text> [-dd <number>]\n```', message);
        let target = message.mentions.users.first() || client.users.cache.get(args[0]) || args[0];
        let tag;
        if (target.tag) tag = target.tag; else tag = target;
        if (target.id) target = target.id;
        if (message.author.id === target) return client.errEmb('You can\'t ban yourself.', message);
        if (args.length < 2) return client.errEmb('A reason is required for this command.', message);
        let reason = args.slice(1).join(' ');
        let ddays = 0;
        if (/-dd\s+\d$/gi.test(reason)) {
            ddays = parseInt(/\d$/g.exec(reason)[0]);
            reason = reason.replace(/-dd\s+\d$/gi, '');
        }
        if (isNaN(ddays) || ddays < 0 || ddays > 7) ddays = 0;
        if (target.bannable) return client.errEmb(`User \`${tag}\` could not be banned.`, message);
        try {
            if (client.users.cache.get(target)) await client.users.cache.get(target).send({embed:{title:'You have been Banned!',description:`**Reason:** ${reason}`,color:0x1e143b,footer:{text:`Sent from ${message.guild.name}`, icon_url:message.guild.iconURL({dynamic:true})}}}).catch(()=>{});
            message.guild.members.ban(target, {days:ddays, reason:message.author.tag +': '+ reason});
            return client.checkEmb(`Successfully Banned \`${tag}\`!`, message);
        } catch (err) {
            return client.errEmb(`Unknown: Failed Banning Member \`${tag}\``, message);
        }
    }
}
