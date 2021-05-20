const { parseFlags } = require('../../functions/stringParser');

module.exports = {
    name: 'massban',
    tag: 'Mass-bans multiple users',
    description: 'Mass-bans multiple users (message optional). Reason must be in quotations, otherwise default is used.',
    usage: 'massban <...User:Mention/ID> [-m Reason:Text]',
    cooldown: 12,
    userPerms: 8,
    botPerms: 4,
    guildOnly: true,
    run: async (client, message, args) => {
        if (!args.length) return client.errEmb('Insufficient Arguments.\n```\nmassban <...User:Mention/ID> [-m Reason:Text]\n```', message);
        const users = [];
        let reason = '(No Reason Specified)';
        const flags = parseFlags(args.join(' '), [{name: 'm', type: 'string', quotes: true}]);
        if (flags[0].value != null && flags[0].value.length) reason = flags[0].value;

        if (message.mentions.users.size) message.mentions.users.forEach(u => users.push(u.id));
        args.forEach(a => {
            if (/(?:<@!?)?\d{17,19}>?/g.test(a)) {
                const id = a.replace(/<@|!|>/g, '');
                if (!users.includes(id)) users.push(id);
            }
        });
        if (users.length < 2) return client.errEmb('Massban Must Have Minimum 2 Users.', message);

        const banned = await message.guild.fetchBans();
        const total = users.length;
        let count = 0, res = 0;
        users.forEach(async id => {
            if (count === 4) {
                count = 0;
                await new Promise(res => setTimeout(res, 3000));
            }
            try {
                if (banned.has(id)) return;
                await message.guild.members.ban(id, {days: 0, reason: `${message.author.tag}: ${reason}`});
                res++;
            } catch {}
            count++;
        });
        return await client.checkEmb(`Successfully Banned ${res} out of ${total} Users!`, message);
    }
}