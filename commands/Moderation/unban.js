require('discord.js');

module.exports = {
    name: 'unban',
    tag: 'Unbans a specified user',
    description: 'Unbans a specified user from the server.',
    usage: 'unban <User:ID> [Reason:text]',
    cooldown: 2,
    userPerms: 4,
    botPerms: 4,
    guildOnly: true,
    run: async (client, message, args) => {
        if (!args.length) return client.errEmb('No User Specified.\n```\nunban <User:ID> [Reason:text]\n```', message);
        const target = args[0];
        if (message.guild.member(target) || !message.guild.fetchBan(target)) return client.errEmb('User is not banned from this server.', message);
        let reason = '(No Reason Specified)';
        if (args.length > 1) reason = args.slice(1).join(' ');
        try {
            await message.guild.members.unban(target, message.author.tag +': '+ reason);
            return client.checkEmb(`Successfully Unbanned \`${target}\`!`, message);
        } catch {
            return client.errEmb(`Unknown: Failed Unbanning User \`${target}\``, message);
        }
    }
}
