require('discord.js');
const advanceClean = require('../../functions/advanceClean');

module.exports = {
    name: 'clean',
    aliases: ['cl','clear','purge'],
    tag: 'Deletes a number of messages in a chat',
    description: 'Deletes a number of messages in a channel (min 1, max 100).\n\n**Flags:**\n`-users` - Deletes only user messages\n`-bots` - Deletes only bot messages\n`-nopin` - Deletes messages that aren\'t pinned\n`-r <Regex>` - Deletes messages matching the pattern',
    usage: 'clean <Amount:Number>\nclean <Amount:Number> [User:Mention/ID]\nclean <Amount:Number> [...Flags]',
    cooldown: 4,
    userPerms: 8192,
    botPerms: 8192,
    guildOnly: true,
    run: async (client, message, args) => {
        if (!args.length) return client.errEmb('No Amount Specified.\n```\nclean <Amount:Number>\nclean <Amount:Number> [User:Mention/ID]\nclean <Amount:Number> [...Flags]\n```\n**Flags:**\n`-users` - Users only\n`-bots` - Bots Only\n`-has <Word>` - Messages that contain a specific word/char', message);
        let amount = parseInt(args[0]);
        if (isNaN(amount) || amount < 1 || amount > 100) return client.errEmb('Invalid Amount Specified. Amount must be a number between 1 and 100.', message);
        if (args.length > 1) {
            var flagArgs = args.slice(1);
            let target = '', flagUsers = false, flagBots = false, flagNopin = false, flagHas = '';
            for (const arg of flagArgs) {
                if (/(<@!?)?\d{17,19}>?/g.test(arg)) target = /(?:<@!?)?(\d{17,19})>?/g.exec(arg)[1];
                if (arg.toLowerCase() === '-users') flagUsers = true;
                if (arg.toLowerCase() === '-bots') flagBots = true;
                if (arg.toLowerCase() === '-nopin') flagNopin = true;
                if (arg.toLowerCase() === '-has') {
                    const index = flagArgs.indexOf(arg);
                    if (index < flagArgs.length) {
                        flagHas = flagArgs[index+1].trim();
                    }
                }
            }
            if (flagUsers && flagBots) return client.errEmb('Both Users & Bots Flags Specified, pick one.', message);
            try {
                const res = await advanceClean(message, amount, {target:target, flagUsers:flagUsers, flagBots:flagBots, flagNopin:flagNopin, flagHas:flagHas});
                return client.checkEmb(`Deleted \`${res}\` Messages!`, message).then(m => setTimeout(() => m.delete(), 3000));
            } catch (err) {
                return client.errEmb(err.message, message);
            }
        } else {
            if (amount < 100) amount += 1;
            try {
                const res = await message.channel.bulkDelete(amount, true);
                return client.checkEmb(`Deleted \`${res.size}\` Messages!`, message).then(m => setTimeout(() => m.delete(), 3000));
            } catch (err) {
                return client.errEmb(err.message, message);
            }
        }
    }
}
