/**
 * Automod Main: Message Filter v2
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { AmodEmbed } = require('.');

module.exports = async (message, automod) => {
    const channel = message.guild.channels.cache.get(automod.channel);

    if (automod.invites) {
        const re = /(?:https?:\/\/)?di?sc(?:ord(?:app)?)?\.(?:com|gg)\/(?:invite\/)?([a-zA-Z0-9]+)/gmi;
        const matches = re.exec(message.content);
        if (matches && matches.length) {
            if (matches[1] === 'channels') return;
            const invites = await message.guild.invites.fetch();
            if (!invites.some(i => i.code === matches[1])) {
                try {
                    await message.delete().catch(()=>{});
                    if (channel) channel.send({
                        embeds:[AmodEmbed(`Invite Code Sent: \`${matches[1]}\``, message)]
                    });
                    return message.channel.send(`${message.author} Invites are not allowed here.`);
                } catch {}
            }
        }
    }

    if (automod.mentions.active) {
        if (message.mentions.users.size) {
            let count = message.mentions.users.size;
            if (automod.mentions.unique) {
                const t = message.mentions.users.map(u => u.id);
                mentions = t.filter(u => t.filter(s => s === u) === 1).length;
            }
            if (count >= automod.mentions.threshold) {
                await message.delete().catch(()=>{});
                if (channel) channel.send({
                    embeds:[AmodEmbed(`${message.mentions.users.size} Mentioned Users`, message)]
                });
                return message.reply(`${message.author} Avoid mass-mentioning users.`).catch(()=>{});
            }
        }
    }
}
