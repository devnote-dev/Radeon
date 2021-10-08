/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { parseAll, parseWithContext } = require('../../functions/strings');
const { resolveMember } = require('../../functions');

module.exports = {
    name: 'ban',
    tag: 'Bans a member from the server',
    description: 'Bans a member from the server. `-dd=<Number>` flag is for the number of days the user\'s messages should be deleted (max 7).',
    usage: 'ban <User:Mention/ID> <Reason:Text> [-dd=<Number>]',
    cooldown: 4,
    userPerms: 4n,
    botPerms: 4n,
    guildOnly: true,
    roleBypass: true,

    async run(client, message, args) {
        if (!args.length) return client.error('Insufficient arguments.\n```\nban <User:Mention/ID> <Reason:Text> [-dd=<Number>]\n```', message);
        const target = message.mentions.users.first() || await resolveMember(message, args.raw) || await client.users.fetch(args.raw[0]);
        if (!target) return client.error('User Not Found', message);
        if (target.id === message.author.id) return client.error('You can\'t ban yourself.', message);
        if (target.id === client.user.id) return client.error('I can\'t ban myself.', message);
        const data = await client.db('automod').get(message.guild.id);
        if (!data) return client.error('Unknown: Failed connecting to server database. Try contacting support.', message);

        let reason = '(No Reason Specified)', ddays = 0;
        if (args.length > 2) reason = args.raw.slice(1).join(' ');
        if (data.BanReason) {
            if (args.length < 2 && reason === '(No Reason Specified)') return client.error('A Reason is required for this command.', message);
        }
        const { short } = parseAll(args.raw.join(' '));
        const flag = parseWithContext(short, { dd: Number }).get('dd');
        if (flag.parsed !== null) {
            ddays = (flag.parsed < 0 || flag.parsed > 7) ? 0 : flag.parsed;
            reason = reason.replace(/\b-dd\s*\d\B/gi, '');
        }

        // if (isBannable(message.guild, target)) return client.error('User cannot be banned.', message);
        const banned = await message.guild.bans.fetch(target.id).catch(()=>{});
        if (banned) return client.error('User is already banned.', message);

        try {
            await target.send(client.actionDM('Banned', message, reason)).catch(()=>{});
            if (data.banMessage) await target.send(data.banMessage +`\n\nBan message sent from **${message.guild.name}**`).catch(()=>{});
            const MS = await message.guild.bans.create(target, {days: ddays, reason: `${message.author.tag}: ${reason}`});
            return client.check(`Successfully banned \`${MS}\``, message);
        } catch {
            return client.error(`Unknown: Failed banning user \`${target.tag}\``, message);
        }
    }
}

async function isBannable(GS, US) {
    try {
        return await client.guilds.cache
            .get(GS.id)
            .members.fetch(US.id)
            .then(m => m.bannable);
    } catch {
        return false;
    }
}
