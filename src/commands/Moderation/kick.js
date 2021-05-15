module.exports = {
    name: 'kick',
    tag: 'Kicks a member from the server',
    description: 'Kicks a member from the server.',
    usage: 'kick <User:Mention/ID> [Reason:Text]',
    cooldown: 4,
    userPerms: 2,
    botPerms: 2,
    guildOnly: true,
    run: async (client, message, args) => {
        if (!args.length) return client.errEmb('No User Specified.\n```\nkick <User:Mention/ID> [Reason:Text]\n```', message);
        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) return client.errEmb('User is not a member of this server.', message);
        if (target.partial) target = await target.fetch();
        if (target.user.id == message.author.id) return client.errEmb('You can\'t kick yourself.', message);
        if (target.user.id == client.user.id) return client.errEmb('I can\'t kick myself.', message);
        let reason = '(No Reason Specified)';
        if (args.length > 1) reason = args.slice(1).join(' ');
        if (!target.kickable) return client.errEmb(`User \`${target.user.tag}\` cannot be Kicked (check role and bot perms).`, message);
        try {
            await target.send(client.actionDM('Kicked', message, reason)).catch(()=>{});
            await target.kick(`${message.author.tag}: ${reason}`);
            return client.checkEmb(`Successfully Kicked \`${target.user.tag}\`!`, message);
        } catch {
            return client.errEmb(`Unknown: Failed Kicking Member \`${target.user.tag}\``, message);
        }
    }
}
