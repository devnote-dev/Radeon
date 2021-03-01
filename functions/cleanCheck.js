require('discord.js');

module.exports.run = async (message, amount, options) => {
    let {target, flagUsers, flagBots, flagRegex} = options;
    let deleted = new Array;
    let re, onlyRegex = false, count = 0;
    const messages = await message.channel.messages.fetch({limit:100});
    if (flagRegex) re = new RegExp(flagRegex,'gi');

    messages.forEach(msg => {
        if (count > amount) return;
        if (flagRegex && !target && !flagUsers && !flagBots) {
            if (re.test(msg.content)) deleted.push(msg);
            onlyRegex = true;
            count++;
        } else {
            if (target) {
                if (msg.author.id === target) {
                    deleted.push(msg);
                    count++;
                }
            } else if (flagUsers && !flagBots) {
                if (!msg.author.bot) {
                    deleted.push(msg);
                    count++;
                }
            } else if (flagBots && !flagUsers) {
                if (msg.author.bot) {
                    deleted.push(msg);
                    count++;
                }
            }
        }
    });

    if (!onlyRegex) {
        if (flagRegex) {
            messages.forEach(m => {
                if (!re.test(msg.content)) deleted.splice(deleted.indexOf(msg))
            });
        }
        if (deleted.length) {
            const num = await message.channel.bulkDelete(deleted,true);
            return num;
        } else {
            return 0;
        }
    } else {
        if (deleted.length) {
            const num = await message.channel.bulkDelete(deleted,true);
            return num;
        } else {
            return 0;
        }
    }
}
