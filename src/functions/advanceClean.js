/**
 * AdvanceClean Message Processor
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { Collection } = require('discord.js');

module.exports = async (message, amount, options) => {
    const { target, flagUsers, flagBots, flagNopin, flagHas, flagTo } = options;
    let filtered = new Collection(), count = 0, messages;
    if (flagTo) {
        messages = await message.channel.messages.fetch({ limit: 100, after: flagTo });
    } else {
        messages = await message.channel.messages.fetch({ limit: 100 });
    }

    if (target || flagUsers || flagBots) {
        messages.forEach(msg => {
            if (count > amount) return;
            if (target) {
                if (msg.author.id === target) {
                    filtered.set(msg.id, msg);
                    count++;
                }
            } else if (flagUsers) {
                if (!msg.author.bot) {
                    filtered.set(msg.id, msg);
                    count++;
                }
            } else if (flagBots) {
                if (msg.author.bot) {
                    filtered.set(msg.id, msg);
                    count++;
                }
            }
        });
    } else {
        messages.forEach(msg => {
            if (count > amount) return;
            filtered.set(msg.id, msg);
            count++;
        });
    }

    if (flagNopin) {
        const temp = new Collection();
        filtered.forEach(msg => { if (!msg.pinned) temp.set(msg.id, msg) });
        filtered = temp;
    }
    if (flagHas) {
        const temp = new Collection();
        filtered.forEach(msg => { if (msg.content.includes(flagHas)) temp.set(msg.id, msg) });
        filtered = temp;
    }

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