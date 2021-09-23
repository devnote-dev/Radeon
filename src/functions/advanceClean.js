/**
 * AdvanceClean Message Processor
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { Collection } = require('discord.js');

module.exports = async (message, amount, options) => {
    const { target, flagUsers, flagBots, flagNopin, flagHas, flagTo, flagEmbeds } = options;
    const filtered = new Collection();
    const messages = await message.channel.messages.fetch({ limit: 100, after: flagTo || null });
    let count = 0;

    if (target, flagUsers, flagBots) {
        for (const [id, msg] of messages) {
            if (count === amount) break;
            if (target) {
                if (msg.author.id === target) {
                    filtered.set(id, msg);
                    count++;
                }
            } else if (flagUsers) {
                if (msg.author.bot) {
                    filtered.set(id, msg);
                    count++;
                }
            } else if (flagBots) {
                if (!msg.author.bot) {
                    filtered.set(id, msg);
                    count++;
                }
            }
        }
    } else {
        for (const [id, msg] of messages) {
            if (count === amount) break;
            filtered.set(id, msg);
        }
    }

    if (flagNopin) filtered.sweep(m => !m.pinned);
    if (flagHas) filtered.sweep(m => m.content.includes(flagHas));
    if (flagEmbeds) filtered.sweep(m => m.embeds?.length);

    if (filtered.size) {
        if (filtered.size === 1) {
            await filtered.first().delete();
            return 1;
        } else {
            const num = await message.channel.bulkDelete(filtered, true);
            return num.size;
        }
    } else {
        return 0;
    }
}
