/**
 * @author Devonte <https://github.com/devnote-dev>
 * @author Piter <https://github.com/piterxyz>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');
const { toDurationDefault, toDurationLong, resolveMember } = require('../../functions');

module.exports = {
    name: 'userinfo',
    tag: 'Info about you or a specified user',
    aliases: ['whois', 'useri', 'ui'],
    description: 'Sends information about a specified user, or the triggering user if none is specified.',
    usage: 'userinfo [User:Mention/ID]',
    cooldown: 8,
    guildOnly: true,
    async run(client, message, args) {
        let target = message.member;
        if (args.length) target = message.mentions.members.first() || await resolveMember(message, args.raw);
        if (!target) return client.errEmb('Invalid Member Specified.', message);
        message.channel.startTyping();
        if (target.partial) target = await target.fetch();
        const member = target;
        target = target.user;

        let roles = [], rest = 0;
        if (member.roles.cache.size) {
            member.roles.cache
                .sort((a, b) => b.position - a.position)
                .forEach(r => { if (r.id !== message.guild.id) roles.push(r) });
            if (roles.length > 5) {
                roles = roles.slice(0, 5);
                rest = member.roles.cache.size - 6;
            }
            roles = roles.join(', ');
            if (rest) roles += `... +${rest} more`;
        }

        let totalf = '';
        const flags = {
            'HOUSE_BRAVERY': '<:hypesquad_bravery:815679606656204831>',
            'HOUSE_BRILLIANCE': '<:hypesquad_brilliance:815679606404546621>',
            'HOUSE_BALANCE': '<:hypesquad_balance:815679606702735420>',
            'HYPESQUAD_EVENTS': '<:hypesquad_events:815697633141981235>',
            'BUGHUNTER_LEVEL_1': '<:BugHunter:818818522506461205>',
            'PARTNERED_SERVER_OWNER': '<:Partner:818818053206835230>'
        }
        if (target.flags) target.flags.toArray().forEach(f => { if (flags[f]) totalf += flags[f] +' ' });
        if (member.premiumSince) totalf += ' <:boost_tier:789702536730509333>';

        const embed = new MessageEmbed()
            .setTitle(`${target.bot ? 'Bot' : 'User'}: ${target.tag}`)
            .setDescription(totalf)
            .addField('ID', `${target.id}`, true)
            .addField('Avatar', `[Download Link 📥](${target.displayAvatarURL({ dynamic: true })})`, true)
            .addField('\u200b', '\u200b', true)
            .addField('Account Age', `${target.createdAt.toDateString()}\n${toDurationLong(target.createdTimestamp)}`, true)
            .addField('Server Member Age', `${member.joinedAt.toDateString()}\n${toDurationDefault(member.joinedTimestamp)}`, true)
            .addField('Roles', roles, false)
            .setColor(member.displayColor || 0x2f3136)
            .setThumbnail(target.displayAvatarURL({ dynamic: true }))
            .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
        setTimeout(() => {
            message.channel.stopTyping();
            return message.channel.send({ embeds:[embed] });
        }, 2000);
    }
}
