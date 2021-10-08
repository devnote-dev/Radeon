/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const advanceClean = require('../../functions/advanceClean');
const { parseAll, parseWithContext } = require('../../functions/strings');

const flags = '`-u/--users` - Only user messages\n`-b/--bots` - Only bot messages\n`-n/--nopin` - Messages that aren\'t pinned\n'+
    '`--has=<Word>` - Messages that contain a specific word/char\n`--to=<Message:ID>` - Messages before that message\n'+
    '`-e/--embeds` - Only messages with embeds';

module.exports = {
    name: 'clean',
    aliases: ['cl','clear','purge'],
    tag: 'Deletes a number of messages in a chat',
    description: 'Deletes a number of messages in a channel (min 1, max 100).\n\n**Flags:**\n'+ flags,
    usage: 'clean <Amount:Number>\nclean <Amount:Number> <User:Mention/ID>\nclean <Amount:Number> <...Flags>',
    cooldown: 6,
    userPerms: 8192n,
    botPerms: 8192n,
    guildOnly: true,
    roleBypass: true,
    async run(client, message, args) {
        if (!args.length) return client.error('No Amount Specified.\n```\nclean <Amount:Number>\nclean <Amount:Number> [User:Mention/ID]\nclean <Amount:Number> [...Flags]\n```\n**Flags:**\n'+ flags, message);
        const amount = parseInt(args.raw[0]);
        if (isNaN(amount) || amount < 1 || amount > 100) return client.error('Invalid amount specified. Amount must be a number between 1 and 100.', message);
        if (args.length > 1) {
            let target = '', flagUsers = false, flagBots = false, flagNopin = false, flagHas = '', flagTo = '', flagEmbeds = false;
            const raw = parseAll(args.raw.join(' '));
            const short = parseWithContext(raw.short, {
                u: Boolean,
                b: Boolean,
                n: Boolean,
                e: Boolean
            });
            const long = parseWithContext(raw.long, {
                users: Boolean,
                bots: Boolean,
                nopin: Boolean,
                has: String,
                to: String,
                embeds: Boolean
            });

            for (const [k, v] of short) {
                if (v.parsed === null) continue;
                if (k === 'u') flagUsers = true;
                if (k === 'b') flagBots = true;
                if (k === 'n') flagNopin = true;
                if (k === 'e') flagEmbeds = true;
            }
            for (const [k, v] of long) {
                if (v.parsed === null) continue;
                if (k === 'users') flagUsers = true;
                if (k === 'bots') flagBots = true;
                if (k === 'nopin') flagNopin = true;
                if (k === 'has') flagHas = v.parsed;
                if (k === 'to') flagTo = v.parsed;
                if (k === 'embeds') flagEmbeds = true;
            }

            if (flagUsers && flagBots) return client.error('Both users & bots flags was specified, pick one.', message);
            if (flagTo && /\D+/g.test(flagTo)) return client.error('Invalid message ID for `to` flag.', message);
            try {
                await message.delete().catch(()=>{});
                const res = await advanceClean(message, amount, { target, flagUsers, flagBots, flagNopin, flagHas, flagTo, flagEmbeds });
                return client.check(`Deleted ${res} message${res > 1 ? 's' : ''}!`, message, 2);
            } catch (err) {
                return client.error(err.message, message);
            }
        } else {
            try {
                await message.delete().catch(()=>{});
                const res = await message.channel.bulkDelete(amount, true);
                return client.check(`Deleted ${res.size} message${res.size > 1 ? 's' : ''}!`, message, 2);
            } catch (err) {
                return client.error(err.message, message);
            }
        }
    }
}
