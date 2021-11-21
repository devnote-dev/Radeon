/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @author Piter <https://github.com/piterxyz>
 * @copyright 2021 Radeon Development
 */

const { prefix } = require('../../config.json');

module.exports = {
    name: 'prefix',
    tag: 'Manages the server prefix',
    description: 'Manages the server prefix for Radeon. Prefixes can be 6 characters long '+
        'and can contain the following characters:\n```\na-z ! ? + - ~ \' ^ * ` ; , : . < > @ & % \\ / $ ( ) £ #\n```',
    usage: 'prefix set <Prefix>\nprefix reset',
    guildOnly: true,
    perms:{
        run: true,
        bit: 32n
    },

    async run(client, message, args, check) {
        if (!args.length) {
            const db = await client.db('guild').get(message.guild.id);
            const embed = client.embed()
                .setTitle('Prefix Settings')
                .setDescription(
                    `**Current Prefix:** \`${db.prefix}\`\n**Default Prefixes:** \`${prefix}\`, ${client.user}\n\n`+
                    'Use `prefix set <Prefix>` or `prefix reset` to update the server prefix.'
                )
                .setFooter('Note: DM commands don\'t require a prefix.');
            return message.reply({ embeds:[embed] });
        }

        if (err = check(message.member, this)) return message.reply(err);
        const sub = args.lower[0];
        if (sub === 'reset') {
            await client.db('guild').update(message.guild.id, { prefix });
            return client.check('Successfully reset the server prefix!', message);
        }

        const newprefix = args.lower[1];
        if (!newprefix) return client.error(this, message);
        if (newprefix.length > 6) return client.error('Prefix cant be longer than 6 characters.', message);
        if (/[^a-zA-Z!\?+-~'\^\*\`;,:\.<>@&%\\\/\$()£#]+/gi.test(newprefix))
            return client.error('New prefix contains illegal characters (see `help prefix`).', message);
        await client.db('guild').update(message.guild.id, { prefix: newprefix });
        return client.check(`Successfully updated server prefix to \`${newprefix}\`!`, message);
    }
}
