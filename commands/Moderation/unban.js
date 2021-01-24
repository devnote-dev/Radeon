require('discord.js');

module.exports = {
    name: 'unban',
    description: 'Unbans a specified user from the server.',
    usage: 'unban <User:ID> [Reason:text]',
    guildOnly: true,
    permissions: ['BAN_MEMBERS'],
    run: async (client, message, args) => {
        if (args.length < 1) return message.channel.send(client.errEmb('No User Specified.\n```\nunban <User:ID> [Reason:text]\n```'));
        const target = args[0];
        if (message.guild.member(target) || !message.guild.fetchBan(target)) return message.channel.send(client.errEmb('User is not banned from this server.'));
        let reason = '(No Reason Specified)';
        if (args.length > 1) reason = args.slice(1).join(' ');
        try {
            await message.guild.unban(target, reason);
            return message.channel.send(client.successEmb(`Successfully Unbanned \`${target}\`!`));
        } catch (err) {
            return message.channel.send(client.errEmb(`Unknown: Failed Unbanning User \`${target}\``));
        }
    }
}
