const { GuildMember, User } = require('discord.js');

module.exports = {
    name: 'ban',
    tag: 'Bans a member from the server',
    description: 'Bans a member from the server. `-dd <Number>` flag is for the number of days the user\'s messages should be deleted (max 7).',
    usage: 'ban <User:Mention/ID> <Reason:Text> [-dd <Number>]',
    cooldown: 2,
    userPerms: 4,
    botPerms: 4,
    guildOnly: true,
    run: async (client, message, args) => {
        if (!args.length) return client.errEmb('Insufficient Arguments.\n```\nban <User:Mention/ID> <Reason:Text> [-dd <Number>]\n```', message);
        let target = message.mentions.users.first() || client.users.cache.get(args[0]);
        let fetched;
        if (!target) {
            try {
                fetched = await client.users.fetch(args[0]);
            } catch {}
            if (target) target = fetched.id; else target = args[0];
        } else {
            target = target.id;
        }
        if (target == message.author.id) return client.errEmb('You can\'t ban yourself.', message);
        if (target == client.user.id) return client.errEmb('I can\'t ban myself.', message);
        if (args.length < 2) return client.errEmb('A Reason is Required for this Command.', message);
        let reason = args.slice(1).join(' ');
        let ddays = 0;
        if (/-dd\s+.+$/gi.test(reason)) {
            ddays = parseInt(/-dd\s+(\d+)$/gi.exec(reason)[1]);
            reason.replace(/-dd\s+.+$/gi, '');
        }
        if (isNaN(ddays) || ddays < 0 || ddays > 7) ddays = 0;
        if (!target.bannable) return client.errEmb('User cannot not be Banned.', message);
        if (message.guild.fetchBan(target)) return client.errEmb('User is already Banned.', message);
        try {
            if (target instanceof User) target.send(client.actionDM('Banned', message, reason)).catch(()=>{});
            let mS = await message.guild.members.ban(target, {days: ddays, reason: `${message.author.tag}: ${reason}`});
            if (mS instanceof GuildMember) {
                mS = mS.user.tag;
            } else if (mS instanceof User) {
                mS = mS.tag;
            }
            return client.checkEmb(`Successfully Banned \`${mS}\``, message);
        } catch {
            return client.errEmb(`Unknown: Failed Banning User \`${fetched ? fetched.tag : target}\``, message);
        }
    }
}
