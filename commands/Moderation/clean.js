require('discord.js');
const cleanCheck = require('../../functions/cleanCheck');

module.exports = {
    name: 'clean',
    aliases: ['cl','clear','purge'],
    description: 'Deletes a number of messages in a channel (min 1, max 100).\n\n**Flags:**\n`User:Mention/ID` - Deletes from a target user\n`-users` - Deletes only user messages\n`-bots` - Deletes only bot messages',
    usage: 'clean <Amount:Number>\nclean <Amount:Number> [User:Mention/ID]\nclean <Amount:Number> [...Flags]',
    cooldown: 3,
    permissions: 8192,
    guildOnly: true,
    run: async (client, message, args) => {
        if (!args.length) return client.errEmb('No Amount Specified.\n```\nclean <Amount:Number>\nclean <Amount:Number> [User:Mention/ID]\nclean <Amount:Number> [...Flags]\n```\n**Flags:**\n`-users` - Users only\n`-bots` - Bots Only\n`-r <Regex>` - Messages that match a certain regex.', message);
        let amount = parseInt(args[0]);
        if (isNaN(amount) || amount < 1 || amount > 100) return client.errEmb('Invalid Amount Specified. Amount must be a number between 1 and 100.', message);
        if (args.length > 1) {
            var flagArgs = args.splice(1);
            let target = '', flagUsers = false, flagBots = false, flagRegex = '';
            for (const arg of flagArgs) {
                if (/(<@!?)?\d{17,19}>?/g.test(arg)) target = /(?:<@!?)?(\d{17,19})>?/g.exec(arg)[1];
                if (arg.toLowerCase() === '-users') flagUsers = true;
                if (arg.toLowerCase() === '-bots') flagBots = true;
                if (arg.toLowerCase() === '-r') {
                    const index = flagArgs.indexOf(arg);
                    if (index < flagArgs.length) {
                        flagRegex = flagArgs[index+1].trim();
                    }
                }
            }
            if (flagUsers && flagBots) return client.errEmb('Both Users & Bots Flags Specified, pick one.', message);
            try {
                const res = await cleanCheck(message, amount, {target:target, flagUsers:flagUsers, flagBots:flagBots, flagRegex:flagRegex});
                return client.checkEmb(`Deleted \`${res.size}\` Messages!`, message).then(m => m.delete({timeout:3000}));
            } catch (err) {
                return client.errEmb(err.message, message);
            }
        } else {
            if (amount < 100) amount += 1;
            try {
                const res = await message.channel.bulkDelete(amount,true);
                return client.checkEmb(`Deleted \`${res.size}\` Messages!`, message).then(m => m.delete({timeout:3000}));
            } catch (err) {
                return client.errEmb(err.message, message);
            }
        }
    }
}
