require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Kicks a member from the server.',
    usage: 'kick <User:Mention/ID> [Reason:text]',
    guildOnly: true,
    permissions: ['KICK_MEMBERS'],
    run: async (client, message, args) => {
        if (args.length < 1) return message.channel.send(client.errEmb('No User Specified.\n```\nkick <User:Mention/ID> [Reason:text]\n```'));
        const target = message.mentions.members.first() || message.guild.member(args[0]);
        if (!target) return message.channel.send(client.errEmb('User is not a member of this server.'));
        let reason = '(No Reason Specified)';
        if (args.length > 1) reason = args.slice(1).join(' ');
        if (!target.kickable) return message.channel.send(client.errEmb(`User \`${target.user.tag}\` could not be kicked (user may have a role higher than the bot).`));
        try {
            await target.send({embed:{title:'You have been kicked!',description:`**Reason:** ${reason}`,color:0x1e143b,footer:{text:`Sent from ${message.guild.name}`, icon_url:message.guild.iconURL({dynamic: true})}}}).catch(()=>{});
            target.kick(message.author.tag +': '+ reason);
            return message.channel.send(client.successEmb(`Successfully Kicked \`${target.user.tag}\`!`));
        } catch (err) {
            return message.channel.send(client.errEmb(`Unknown: Failed Kicking Member \`${target.user.tag}\``));
        }
    }
}
