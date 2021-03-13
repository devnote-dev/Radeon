require('discord.js');

module.exports = async (client, message, automod) => {
    let chan;
    if (automod.channel) chan = message.guild.channels.cache.get(automod.channel);
    if (automod.invites) {
        const regex = new RegExp(/(?:https?)?(?:di?sc(?:ord(?:app)?)?|top)?\.(?:gg|com|inv(?:ite)?)\/([\w-]+)/, 'gmi');
        if (regex.test(message.content)) {
            const matches = regex.exec(message.content);
            if (!matches) return console.log(`${message.guild.id}: messageCheck action cancelled.`);
            const invites = await message.guild.fetchInvites();
            let notFromGuild = false;
            if (invites.size) {
                invites.array().forEach(i => {
                    if (i.code == matches[1]) notFromGuild = true
                });
            }
            if (notFromGuild) {
                try {
                    message.delete();
                    if (chan) {
                        chan.send(client.logEmb(`Invite Code Sent: \`${matches[1]}\``, message.author, message.channel)).catch(()=>{});
                    }
                    return message.reply('Invites are not allowed here.');
                } catch (err) {
                    return console.error();
                }
            }
        }
    }
    if (automod.massMention.active) {
        if (message.mentions.members.size >= automod.massMention.thres) {
            message.delete();
            if (chan) chan.send(client.logEmb(`${message.mentions.members.size} Mentioned Users`, message.author, message.channel)).catch(()=>{});
            return message.reply('Avoid mass-mentioning users.');
        }
    }
}
