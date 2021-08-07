/**
 * Automod Main: Message Filter v2
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { AmodEmbed } = require('.');

module.exports = async (message, automod) => {
    let channel;
    if (automod.channel) channel = message.guild.channels.cache.get(automod.channel);

    if (automod.invites) {
        const re = /(?:https?:\/\/)?di?sc(?:ord(?:app)?)?\.(?:com|gg)\/(?:invite\/)?([a-zA-Z0-9]+)/gmi;
        const matches = re.exec(message.content);
        if (matches && matches.length) {
            if (matches[1] === 'channels') return;
            const invites = await message.guild.fetchInvites();
            if (!invites.some(i => i.code === matches[1])) {
                try {
                    await message.delete().catch(()=>{});
                    if (channel) {
                        channel.send(AmodEmbed(`Invite Code Sent: \`${matches[1]}\``, message));
                    }
                    return message.channel.send(`${message.author} Invites are not allowed here.`);
                } catch {}
            }
        }
    }

    if (automod.massMention.active) {
        if (message.mentions.users.size) {
            if (message.mentions.users.size >= automod.massMention.thres) {
                await message.delete().catch(()=>{});
                if (channel) {
                    channel.send(AmodEmbed(`${message.mentions.users.size} Mentioned Users`, message));
                }
                return message.reply(`${message.author} Avoid mass-mentioning users.`).catch(()=>{});
            }
        }
    }
}
