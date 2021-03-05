require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Kicks a member from the server.',
    usage: 'kick <User:Mention/ID> [Reason:text]',
    cooldown: 2,
    permissions: 2,
    guildOnly: true,
    run: async (client, message, args) => {
        if (!args.length) return client.errEmb('No User Specified.\n```\nkick <User:Mention/ID> [Reason:text]\n```', message);
        const target = message.mentions.members.first() || message.guild.member(args[0]);
        if (!target) return client.errEmb('User is not a member of this server.', message);
        let reason = '(No Reason Specified)';
        if (args.length > 1) reason = args.slice(1).join(' ');
        if (!target.kickable) return client.errEmb(`User \`${target.user.tag}\` could not be kicked (user may have a role higher than the bot).`, message);
        try {
            await target.send({embed:{title:'You have been kicked!',description:`**Reason:** ${reason}`,color:0x1e143b,footer:{text:`Sent from ${message.guild.name}`, icon_url:message.guild.iconURL({dynamic: true})}}}).catch(()=>{});
            target.kick(message.author.tag +': '+ reason);
            return client.checkEmb(`Successfully Kicked \`${target.user.tag}\`!`, message);
        } catch (err) {
            return client.errEmb(`Unknown: Failed Kicking Member \`${target.user.tag}\``, message);
        }
    }
}
