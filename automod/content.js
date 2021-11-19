/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */

const { AmodEmbed } = require('.');

const noop = () => {};

module.exports = async (client, message, automod) => {
    const channel = message.guild.channels.cache.get(automod.channel);

    if (automod.invites) {
        const expr = /(?:https?:\/\/)?di?sc(?:ord(?:app)?)?\.(?:com|gg)\/(?:invite\/)?([a-zA-Z0-9]+)/gmi;
        const matches = expr.exec(message.content);
        if (matches?.length) {
            if (matches[1] === 'channels') return;
            let invites = message.guild.invites.cache;
            if (!invites.size) invites = await message.guild.invites.fetch();
            if (!invites.some(i => i.code === matches[1])) {
                try {
                    await message.delete().catch(noop);
                    if (channel) channel.send({
                        embeds:[AmodEmbed(`Invite code sent: \`${matches[1]}\``, message)]
                    });
                    return message.channel.send(`${message.author}, invites are not allowed here.`);
                } catch {}
            }
        }
    }

    if (automod.mentions.active) {
        if (count = message.mentions.users.size) {
            if (automod.mentions.unique) {
                const ids = message.mentions.users.map(u => u.id);
                count = ids.filter(u => ids.filter(i => i === u).length === 1).length;
            }
            if (count >= automod.mentions.limit) {
                try {
                    await message.delete().catch(noop);
                    if (channel) channel.send({
                        embeds:[AmodEmbed(`${message.mentions.users.size} mentioned users`, message)]
                    });
                    return message.channel.send(`${message.author}, avoid mass-mentioning users.`).catch(noop);
                } catch {}
            }
        }
    }

    if (automod.floods) {
        let content = message.content.split('\\n');
        let flag = false;
        if (content.length >= 10) flag = true;
        if (content.length >= 4) {
            const expr = new RegExp(`.*${content[0]}.*`, 'gmi');
            let count = 0;
            for (const line of content) {
                if (expr.test(line)) count++;
            }
            if (count >= 4) flag = true;
        }

        if (flag) {
            try {
                await message.delete().catch(noop);
                if (channel) channel.send({
                    embeds:[AmodEmbed('Sending flood messages', message)]
                });
                return message.channel.send(`${message.author}, do not flood channels.`).catch(noop);
            } catch {}
        }
    }
}
