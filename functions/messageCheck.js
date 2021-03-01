require('discord.js');

module.exports.run = async (client, message, automod) => {
    let chan;
    if (automod.channel) chan = message.guild.channels.cache.get(automod.channel);
    if (automod.invites) {
        const regex = /(?:https?)?(?:di?sc(?:ord(?:app)?)?|top)\.(?:gg|com|inv(?:ite)?)\/[\w]+/gi;
        if (regex.test(message.content)) {
            message.delete();
            if (chan) {
                const code = message.content.match(regex)[0];
                chan.send(client.logEmb(`Invite Code Sent: \`${code}\``, message.author, message.channel)).catch(()=>{});
            }
            return message.reply('Invites are not allowed here.');
        }
    }
    if (automod.massMention.active) {
        if (message.mentions.members.length >= automod.massMention.limit) {
            message.delete();
            if (chan) chan.send(client.logEmb(`${message.mentions.users.size} Mentioned Users`, message.author, message.channel)).catch(()=>{});
            return message.reply('Avoid mass-mentioning users.');
        }
    }
}
