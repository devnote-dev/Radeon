/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */ 

const { resolve } = require('../../util');

module.exports = {
    name: 'muteset',
    tag: 'Mute system settings command',
    description: 'Manages settings for the mute system.',
    usage: 'muteset setup\nmuteset role <Role:Name/Mention/ID>\nmuteset reason\nmuteset reset',
    guildOnly: true,
    perms:{
        run: true,
        bit: 32n
    },

    async run(client, message, args, check) {
        if (err = check(message.member, this)) return message.reply(err);

        if (!args.length) {
            const { modLogs } = await client.db('automod').get(message.guild.id);
            const role = modLogs.muteRole && resolve(modLogs.muteRole, 'role', message.guild);
            const embed = client.embed()
                .setTitle('Mute Settings')
                .setDescription(
                    'To set a new mute role use the `muteset role` command or the '+
                    '`muteset setup` command. See `help muteset` for other subcommands.'
                )
                .addField('Role', role ? `${role} (${role.id})` : 'Not Set', true)
                .addField('Reason Required', modLogs.muteReason?.toString() ?? 'false', true);
            return message.reply({ embeds:[embed] });
        }

        const sub = args.lower[0];
        if (sub === 'reset') {
            await client.db('automod').update(
                message.guild.id,
                { modLogs:{ muteRole: '', muteReason: true }}
            );
            return client.check('Successfully reset mute settings!', message);

        } else if (sub === 'role') {
            if (!args.raw[1]) return client.error(this, message);
            const role = resolve(args.raw[1], 'role', message.guild);
            if (!role) return client.error('Role not found. Make sure the role name is case-sensitive.', message);
            const db = client.db('automod');
            const { modLogs } = await db.get(message.guild.id);
            await db.update(
                message.guild.id,
                { modLogs:{ muteRole: role.id, muteReason: modLogs.muteReason }}
            );
            return client.check(`Successfully updated the mute role to ${role}!`, message);

        } else if (sub === 'reason') {
            const db = client.db('automod');
            const { modLogs } = await db.get(message.guild.id);
            await db.update(
                message.guild.id,
                { modLogs:{ muteRole: modLogs.muteRole, muteReason: !modLogs.muteReason }}
            );
            return client.check(
                `Successfully ${modLogs.muteReason ? 'disabled' : 'enabled'} required mute reason check!`,
                message
            );

        } else if (sub === 'setup') {
            if (err = check(message.guild.me, 268435456n)) return message.reply(err.replace('You are', 'I am'));

            let role = message.guild.roles.cache.find(r => r.name.toLowerCase().includes('mute'));
            if (!role) {
                role = await message.guild.roles.create({
                    name: 'Muted',
                    color: 0x282a2e,
                    hoist: false,
                    permissions: 0n,
                    position: message.guild.me.roles.highest.position - 1,
                    mentionable: false,
                    reason: `Mute role setup by ${message.author.tag}`
                });
            }
            await client.db('automod').update(
                message.guild.id,
                { modLogs:{ muteRole: role.id, muteReason: true }}
            );
            return client.check(`Successfully set the mute role to ${role}!`, message);
        } else {
            return client.error('Unknown subcommand. See `help muteset` for more information.', message);
        }
    }
}
