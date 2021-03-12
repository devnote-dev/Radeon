require('discord.js');
const re2 = require('re2');

module.exports = async (message, amount, options) => {
    let { target, flagUsers, flagBots, flagNopin, flagRegex } = options;
    let filtered = [], count = 0, regex;
    const messages = await message.channel.messages.fetch({limit: 100});
    if (flagRegex) regex = new re2(flagRegex, 'gm');

    if (target || flagUsers || flagBots) {
        messages.forEach(msg => {
            if (count > amount) return;
            if (target) {
                if (msg.author.id == target) {
                    filtered.push(msg);
                    count++;
                }
            } else if (flagUsers) {
                if (!msg.author.bot) {
                    filtered.push(msg);
                    count++;
                }
            } else if (flagBots) {
                if (msg.author.bot) {
                    filtered.push(msg);
                    count++;
                }
            }
        });
    } else {
        filtered = messages.array();
    }

    if (flagNopin) {
        let temp = [];
        filtered.forEach(msg => {
            if (!msg.pinned) temp.push(msg);
        });
        filtered = temp;
    }
    if (regex) {
        let temp = [];
        filtered.forEach(msg => {
            if (regex.test(msg.content)) temp.push(msg);
        });
        filtered = temp;
    }

    if (filtered.length) {
        const num = await message.channel.bulkDelete(filtered, true);
        return num.size;
    } else {
        return 0;
    }
}