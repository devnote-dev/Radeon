/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed, Collection } = require('discord.js');
const { toDurationDefault } = require('../../dist/functions');

module.exports = {
    name: 'roleinfo',
    tag: 'Sends information about a specific role.',
    aliases: ['ri'],
    description: 'Sends information about a specified role.',
    usage: 'roleinfo <Role:Name/Mention/ID>',
    cooldown: 5,
    guildOnly: true,
    async run(client, message, args) {
        if (!args.length) return client.errEmb('No Role Specified.\n```\nroleinfo <Role:Name/Mention/ID>\n```', message);
        let role = message.mentions.roles.first()
            || message.guild.roles.resolve(args.join(' '))
            || message.guild.roles.cache.filter(r => r.name.toLowerCase().includes(args.join(' ').toLowerCase()));
        if (role instanceof Collection) {
            if (!role.size) return client.errEmb('Role Not Found!', message);
            if (role.size > 1) {
                const temp = role.find(r => r.name.toLowerCase() === args.join(' ').toLowerCase());
                if (temp) {
                    role = temp;
                } else {
                    let rmap = role.map(r => `• ${r.name} (ID ${r.id})`).join('\n');
                    return client.infoEmb(`More than one role found with similar names:\n\n${rmap}`, message);
                }
            } else role = role.first();
        }
        if (!role) return client.errEmb('Role Not Found!', message);
        message.channel.startTyping();
        const embed = new MessageEmbed()
        .setTitle(`Role: ${role.name}`)
        .addField('ID', `${role.id}`, false)
        .addField('Color', role.hexColor, true)
        .addField('Position', `${role.position}`, true)
        .addField('Hoisted', `${role.hoist}`, true)
        .addField('Created At', toDurationDefault(role.createdTimestamp), false)
        .addField('Managed', `${role.managed}`, true)
        .addField('Mentionable', `${role.mentionable}`, true)
        .addField('Members', `${role.members.size}`, true)
        .addField('Permissions', `${role.permissions.bitfield} (Bitfield)`, false)
        .setColor(role.color || 0x2f3136)
        .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
        setTimeout(() => {
            message.channel.stopTyping();
            return message.channel.send({ embeds: [embed] })
        }, 1000);
    }
}
