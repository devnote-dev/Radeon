/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const Warns = require('../../schemas/warnings');

module.exports = {
    // name: 'warn',
    tag: 'Warns a specified user',
    description: 'Warns a specified user.',
    usage: 'warn <User:Mention/ID> <Reason:Text>',
    userPerms: 8192,
    guildOnly: true,
    async run(client, message, args) {
        if (!args.length) return client.errEmb('Insufficient Arguments.\n```\nwarn <User:Mention/ID> <Reason:Text>\n```', message);
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) return client.errEmb('Invalid Member Specified.', message);
        if (!args[1]) return client.errEmb('No Reason Specified.', message);
        const reason = args.slice(1).join(' ');
        try {
            await Warns.findOneAndUpdate(
                { guildID: message.guild.id },
                { $set:{ userid: target.user.id, reason: reason, mod: message.author.id, date: new Date() }}
            );
        } catch {
            return client.errEmb('Unknown: Failed Warning Member. Try again later.', message);
        }
        let sent = true;
        try {
            await target.user.send(client.actionDM('Warned', message, `**Reason:** ${reason}`));
        } catch {
            sent = false;
        }
        if (sent) {
            return client.checkEmb(`\`${target.user.tag}\` was warned!`, message);
        } else {
            return client.checkEmb(`Warning logged for \`${target.user.tag}\`! (DMs were unavailable).`, message);
        }
    }
}