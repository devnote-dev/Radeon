require('discord.js');

module.exports = {
    name: 'unban',
    tag: 'Unbans a specified user',
    description: 'Unbans a specified user from the server.',
    usage: 'unban <User:ID> [Reason:text]',
    cooldown: 3,
    userPerms: 4,
    botPerms: 4,
    guildOnly: true,
    run: async (client, message, args) => {
        if (!args.length) return client.errEmb('No User Specified.\n```\nunban <User:ID> [Reason:Text]\n```', message);
        const target = args[0];
        if (!/^\d{17,19}$/g.test(target)) return client.errEmb('Invalid User ID Specified.', message);
        if (message.guild.members.cache.get(target) || !message.guild.fetchBan(target)) return client.errEmb('User is not banned from this server.', message);
        let reason = '(No Reason Specified)';
        if (args.length > 1) reason = args.slice(1).join(' ');
        try {
            const uS = await message.guild.members.unban(target, `${message.author.tag}: ${reason}`);
            return client.checkEmb(`Successfully Unbanned \`${uS.tag}\`!`, message);
        } catch {
            return client.errEmb(`Unknown: Failed Unbanning User \`${target}\``, message);
        }
    }
}
