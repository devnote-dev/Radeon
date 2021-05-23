/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');
const Guild = require('../../schemas/guild-schema');

module.exports = {
    name: 'seteveryone',
    aliases: ['set-everyone','se'],
    description: 'Sets the "everyone" role for the server (used in lockdown commands).',
    usage: 'seteveryone <Role:Name/Mention/ID>\nseteveryone reset',
    guildOnly: true,
    modBypass: true,
    userPerms: 32,
    async run(client, message, args) {
        if (!args.length) {
            const gData = await Guild.findOne({ guildID: message.guild.id });
            let role;
            if (gData.everyoneRole.length) {
                role = message.guild.roles.cache.get(gData.everyoneRole);
                if (!role) role = message.guild.roles.everyone;
            } else {
                role = message.guild.roles.everyone;
            }
            const embed = new MessageEmbed()
            .setTitle('Everyone Role')
            .setDescription(`The everyone role for this server is ${role}. To set a new everyone role use the \`seteveryone <Role:Name/Mention/ID>\` command.`)
            .setColor(0x1e143b)
            .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
            return message.channel.send(embed);
        } else {
            if (args[0].toLowerCase() == 'reset') {
                await Guild.findOneAndUpdate(
                    { guildID: message.guild.id },
                    { $set:{ everyoneRole: '' }},
                    { new: true }
                );
                return client.checkEmb('Everyone Role was Successfully Reset!', message);
            } else {
                const role = message.mentions.roles.first()
                || message.guild.roles.resolve(args[0])
                || message.guild.roles.cache.find(r => r.name.toLowerCase() == args[0].toLowerCase());
                if (!role) return client.errEmb('Argument Specified is an Invalid Role.', message);
                if (role.id === message.guild.roles.everyone.id) return client.infoEmb('No changes made. Did you mean `seteveryone reset`?', message);
                await Guild.findOneAndUpdate(
                    { guildID: message.guild.id },
                    { $set:{ everyoneRole: role.id }},
                    { new: true }
                );
                return client.checkEmb(`Everyone Role was Successfully Set to ${role}!`, message);
            }
        }
    }
}