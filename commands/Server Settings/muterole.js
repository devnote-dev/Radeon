const {MessageEmbed} = require('discord.js');
const Guild = require('../../schemas/guild-schema');

module.exports = {
    name: 'muterole',
    aliases: ['set-muterole'],
    description: 'Set\'s the mute role for this server.',
    usage: 'muterole <Role:Name/Mention/ID>',
    guildOnly: true,
    permissions: ['MANAGE_ROLES'],
    run: async (client, message, args) => {
        if (args.length < 1) {
            const data = await Guild.findOne({guildID: message.guild.id});
            let res = 'There is no muted role setup for this server.';
            if (data.muteRole) res = `The muted role for this server is <@&${data.muteRole}>.`;
            const embed = new MessageEmbed()
            .setTitle('Mute Role')
            .setDescription(res + '\nTo set a new muted role use the `muterole <Role:Name/Mention/ID>` command.')
            .setColor(0x1e143b)
            .setFooter(`Triggered By ${message.author.tag}`, message.author.avatarURL());
            return message.channel.send(embed);
        }
        const role = message.guild.roles.cache.find(r => r.name.toLowerCase() === args[0].toLowerCase()) || message.mentions.roles.first() || message.guild.roles.resolve(args[0]);
        if (!role) return message.channel.send(client.errEmb('Argument Specified is an Invalid Role.'));
        await Guild.findOneAndUpdate(
            { guildID: message.guild.id },
            { $set:{ muteRole: role.id } },
            { new: true }
        );
        message.channel.send(client.successEmb(`Mute role was successfully set to ${role}!`));
    }
}
