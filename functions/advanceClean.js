// Advanced Clean Processor
// Current Issues: None
// © Radeon Development 2021 (GNU GPL v3)

module.exports = async (message, amount, options) => {
    const { target, flagUsers, flagBots, flagNopin, flagHas } = options;
    let filtered = [], count = 0;
    const messages = await message.channel.messages.fetch({limit: 100});

    if (target || flagUsers || flagBots) {
        messages.array().forEach(msg => {
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
        messages.array().forEach(msg => {
            if (count > amount) return;
            filtered.push(msg);
        });
    }

    if (flagNopin) {
        const temp = [];
        filtered.forEach(msg => { if (!msg.pinned) temp.push(msg) });
        filtered = temp;
    }
    if (flagHas) {
        const temp = [];
        filtered.forEach(msg => { if (msg.content.includes(flagHas)) temp.push(msg) });
        filtered = temp;
    }

    if (filtered.length) {
        if (filtered.length == 1) {
            await filtered[0].delete();
            return 1;
        } else {
            const num = await message.channel.bulkDelete(filtered, true);
            return num.size;
        }
    } else {
        return 0;
    }
}