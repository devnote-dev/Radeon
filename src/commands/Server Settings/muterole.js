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
    guildOnly: true,
    userPerms: 32,
    async run(client, message, args) {
        if (!args.length) {
            const data = await client.db('guild').get(message.guild.id);
            let res = 'There is no muted role setup for this server.';
            if (data.muteRole) res = `The muted role for this server is <@&${data.muteRole}>.`;
            const embed = new MessageEmbed()
            .setTitle('Mute Role')
            .setDescription(res + '\nTo set a new muted role use the `muterole <Role:Name/Mention/ID>` command.')
            .setColor(0x1e143b)
            .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
            return message.channel.send(embed);
        } else {
            if (args[0] === 'reset') {
                await client.db('guild').update(message.guild.id, { muteRole: '' });
                return client.checkEmb('Mute role was successfully reset!', message);
            } else {
                const role = message.mentions.roles.first() || message.guild.roles.resolve(args[0]) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args[0].toLowerCase());
                if (!role) return client.errEmb('Argument Specified is an Invalid Role.', message);
                await client.db('guild').update(message.guild.id, { muteRole: role.id });
                return client.checkEmb(`Mute role was successfully set to ${role}!`, message);
            }
        }
    }
}
