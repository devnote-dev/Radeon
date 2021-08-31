/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { resolveMember } = require('../../functions');

module.exports = {
    name: 'kick',
    tag: 'Kicks a member from the server',
    description: 'Kicks a member from the server.',
    usage: 'kick <User:Mention/ID> <Reason:Text>',
    cooldown: 4,
    userPerms: 2n,
    botPerms: 2n,
    guildOnly: true,
    roleBypass: true,
    async run(client, message, args) {
        if (!args.length) return client.errEmb('No User Specified.\n```\nkick <User:Mention/ID> <Reason:Text>\n```', message);
        const target = message.mentions.members.first() || await resolveMember(message, args.raw);
        if (!target) return client.errEmb('User is not a member of this server.', message);
        if (target.user.id === message.author.id) return client.errEmb('You can\'t kick yourself.', message);
        if (target.user.id === client.user.id) return client.errEmb('I can\'t kick myself.', message);
        let data = await client.db('guild').get(message.guild.id);
        if (!data) return client.errEmb('Unknown: Failed connecting To server database. Try contacting support.', message);
        data = data.automod;
        let reason = '(No Reason Specified)';
        if (args.length > 1) reason = args.slice(1).join(' ');
        if (data.KickReason && reason === '(No Reason Specified)') {
            return client.errEmb('A Reason is required for this command.', message);
        }
        if (!target.kickable) return client.errEmb(`User \`${target.user.tag}\` cannot be Kicked (check role and bot perms).`, message);
        try {
            await target.send({ embeds:[client.actionDM('Kicked', message, reason)] }).catch(()=>{});
            await target.kick(`${message.author.tag}: ${reason}`);
            return client.checkEmb(`Successfully kicked \`${target.user.tag}\`!`, message);
        } catch {
            return client.errEmb(`Unknown: Failed Kicking member \`${target.user.tag}\``, message);
        }
    }
}
