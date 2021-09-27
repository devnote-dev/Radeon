/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'muterole',
    aliases: ['set-muterole'],
    description: 'Set\'s the mute role for this server.',
    usage: 'muterole <Role:Name/Mention/ID>\nmuterole reset',
    userPerms: 32n,
    guildOnly: true,
    async run(client, message, args) {
        if (!args.length) {
            const data = await client.db('guild').get(message.guild.id);
            let res = 'There is no muted role setup for this server.';
            if (data.muteRole) res = `The muted role for this server is <@&${data.muteRole}>.`;
            const embed = new MessageEmbed()
                .setTitle('Mute Role')
                .setDescription(res + '\nTo set a new muted role use the `muterole <Role:Name/Mention/ID>` command or the `muterole setup` command.')
                .setColor(0x1e143b)
                .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
            return message.channel.send({ embeds: [embed] });
        }
        if (args[0].toLowerCase() === 'reset') {
            await client.db('guild').update(message.guild.id, { muteRole: '' });
            return client.checkEmb('Mute role was successfully reset!', message);
        } else if (args[0].toLowerCase() === 'setup') {
            const data = await client.db('guild').get(message.guild.id);
            if (data.muteRole) return client.infoEmb('Muted role is already setup.', message);
            let role = message.guild.roles.cache.find(r => r.name.toLowerCase().includes('muted'));
            if (!role) {
                if (!message.guild.me.permissions.has(268435456n)) return client.errEmb('Unable to setup muted role: missing `Manage Roles` permissions.', message);
                role = await message.guild.roles.create({
                    name:        'Muted',
                    color:       0x282a2e,
                    hoist:       false,
                    permissions: 0n,
                    position:    message.guild.me.roles.highest.position - 1,
                    mentionable: false
                });
                message.guild.channels
                    .filter(c => c.isText())
                    .forEach(async c => {
                        await c.permissionOverwrites.create(role, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false
                        }).catch(()=>{});
                        await new Promise(res => setTimeout(res, 750));
                    });
                await client.db('guild').update(message.guild.id, { muteRole: role.id });
                return client.checkEmb('Muted role successfully setup!', message);
            }
        } else {
            const role =
                message.mentions.roles.first()
                || message.guild.roles.resolve(args[0])
                || message.guild.roles.cache.find(r => r.name.toLowerCase() === args[0].toLowerCase());
            if (!role) return client.errEmb('Invalid role specified.', message);
            await client.db('guild').update(message.guild.id, { muteRole: role.id });
            return client.checkEmb(`Muted role was successfully set to ${role}!`, message);
        }
    }
}
