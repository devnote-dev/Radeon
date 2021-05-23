/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const advanceClean = require('../../functions/advanceClean');
const { parseFlags } = require('../../functions/stringParser');
const flags = '`-users` - Deletes only user messages\n`-bots` - Deletes only bot messages\n`-nopin` - Deletes messages that aren\'t pinned\n`-has <Word>` - Messages that contain a specific word/char\n`-to <Message:ID>` - Messages before that message';

module.exports = {
    name: 'clean',
    aliases: ['cl','clear','purge'],
    tag: 'Deletes a number of messages in a chat',
    description: 'Deletes a number of messages in a channel (min 1, max 100).\n\n**Flags:**\n'+ flags,
    usage: 'clean <Amount:Number>\nclean <Amount:Number> <User:Mention/ID>\nclean <Amount:Number> <...Flags>',
    cooldown: 6,
    userPerms: 8192,
    botPerms: 8192,
    guildOnly: true,
    async run(client, message, args) {
        if (!args.length) return client.errEmb('No Amount Specified.\n```\nclean <Amount:Number>\nclean <Amount:Number> [User:Mention/ID]\nclean <Amount:Number> [...Flags]\n```\n**Flags:**\n'+ flags, message);
        let amount = parseInt(args[0]);
        if (isNaN(amount) || amount < 1 || amount > 100) return client.errEmb('Invalid Amount Specified. Amount must be a number between 1 and 100.', message);
        if (args.length > 1) {
            let target = '', flagUsers = false, flagBots = false, flagNopin = false, flagHas = '', flagTo = '';
            const parsed = parseFlags(args.slice(1).join(' '), [
                {name: 'users', type: 'bool'},
                {name: 'bots', type: 'bool'},
                {name: 'nopin', type: 'bool'},
                {name: 'has', type: 'string', quotes: false},
                {name: 'to', type: 'int'}
            ]);
            parsed.forEach(flag => {
                if (flag.name === 'users' && flag.value) flagUsers = true;
                if (flag.name === 'bots' && flag.value) flagBots = true;
                if (flag.name === 'nopin' && flag.value) flagNopin = true;
                if (flag.name === 'has' && flag.value != null) flagHas = flag.value;
                if (flag.name === 'to' && flag.value != null) flagTo = flag.value;
            });
            if (flagUsers && flagBots) return client.errEmb('Both Users & Bots Flags Specified, pick one.', message);
            if (flagTo && /\D+/g.test(flagTo)) return client.errEmb('Invalid Message ID for To Flag.', message);
            try {
                await message.delete().catch(()=>{});
                const res = await advanceClean(message, amount, {target, flagUsers, flagBots, flagNopin, flagHas, flagTo});
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
