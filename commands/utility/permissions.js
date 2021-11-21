/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */

const { humanize, resolve } = require('../../util');

module.exports = {
    name: 'permissions',
    aliases:['perms', 'permsof'],
    tag: 'Permission management tools',
    description: 'Permission toos: view, create and resolve permissions.',
    usage: 'permissions [User:Mention/ID]\npermissions <User:Mention/ID> in <Channel:Mention/ID>\n'+
        'permissions in <Channel:Mention/ID>\npermissions create <...Name; ...>\n'+
        'permissions resolve <Bitfield:Number>\npermissions diff <User/Channel/Role> <User/Channel/Role>',

    async run(client, message, args) {
        const { guild, author, member } = message;
        if (!args.length) {
            const perms = member.permissions.has(8n)
                ? 'Administrator'
                : humanize(member.permissions.bitfield);
            const embed = client.embed()
                .setAuthor(`Permissions of ${author.tag}`, author.displayAvatarURL())
                .setDescription(`\`\`\`\n${perms}\n\`\`\`\n**Bitfield:** ${member.permissions.bitfield}`);
            return message.reply({ embeds:[embed] });
        }

        const sub = args.lower[0];
        if (/\d{17,}/g.test(sub)) {
            sub = sub.replace(/[^\d]+/g, '');
            sub = await guild.members.fetch(sub).catch(()=>{});
            if (!sub) return client.error('Member not found.', message);

            if (args.lower[1] === 'in') {
                if (!args.raw[2]) return client.error(
                    'Channel not specified.\n\`\`\`permissions <User:Mention/ID> in <Channel:Mention/ID>\n\`\`\`',
                    message
                );
                const chan = resolve(args.raw[2], 'channel', guild);
                if (!chan) return client.error('Channel not found.', message);
                const bit = chan.permissionsFor(sub);
                const perms = bit.has(8n)
                    ? 'Administrator'
                    : humanize(bit.bitfield);

                const embed = client.embed()
                    .setAuthor(`Permissions of ${sub.user.tag} in ${chan.name}`)
                    .setDescription(`\`\`\`\n${perms}\n\`\`\`\n**Bitfield:** ${bit.bitfield}`);
                return message.reply({ emebds:[embed] });
            }
        }
    }
}
