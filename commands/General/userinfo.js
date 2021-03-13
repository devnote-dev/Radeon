const { MessageEmbed } = require('discord.js');
const { toDurationDefault } = require('../../functions/functions');

module.exports = {
    name: 'userinfo',
    aliases: ['whois'],
    description: 'Sends information about a specified user, or the triggering user if none is specified.',
    usage: 'userinfo [User:Mention/ID]',
    cooldown: 5,
    guildOnly: true,
    run: async (client, message, args) => {
        let target = message.author;
        if (args.length) target = message.mentions.users.first() || message.guild.member(args[0]).user;
        if (!target) return client.errEmb('Invalid Member Specified.', message);
        const member = message.guild.member(target);
        let color = member.roles.cache.find(r => r.hexColor != '#000000');
        if (!color || !color.hexColor) color = 0x2f3136; else color = color.hexColor;

        switch (target.presence.status) {
            case 'online': status = '<:status_online:782290447149432892> Online'; break;
            case 'idle': status = '<:status_idle:782290447123873824> Idle'; break;
            case 'dnd': status = '<:status_dnd:782290447028191243> DND'; break;
            case 'offline': status = '<:status_offline:782290447057813524> Offline'; break;
            default: status = 'unknown'; break;
        }

        let presence = 'None or not cached.';
        if (target.presence.activities.length) {
            presence = '';
            target.presence.activities.forEach(act => {
                if (act.type === 'CUSTOM_STATUS') presence += 'Custom: '+ act.state +'\n';
                if (act.type === 'PLAYING') presence += '🎮 playing '+ act.name +'\n';
                if (act.type === 'LISTENING') {
                    let em = '🎧';
                    if (act.name == 'Spotify') em = '<:Spotify:815659926637903883>';
                    if (act.details && act.state) {
                        presence += `${em} ${act.details} - ${act.state}\n`;
                    } else {
                        presence += `${em} ${act.name}\n`;
                    }
                }
                if (act.type === 'WATCHING') presence += '📺 watching '+ act.name +'\n';
            });
            if (!presence.length) presence = 'Unknown Activity';
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
        if (target.bot) {
            if (target.flags.toArray().includes('VERIFIED_BOT')) {
                totalf += '<:verified_bot:816434217646161930>';
            } else {
                totalf += '<:bot:816434217470001172>';
            }
        }

        const embed = new MessageEmbed()
        .setTitle(target.tag)
        .setDescription(totalf)
        .addField('ID', `${target.id}`, true)
        .addField('Status', status, true)
        .addField('Avatar', `[Download Link 📥](${target.displayAvatarURL({dynamic: true})})`, true)
        .addField('Account Age', `${target.createdAt.toDateString()}\n${toDurationDefault(target.createdTimestamp)}`, false)
        .addField('Server Member Age', `${member.joinedAt.toDateString()}\n${toDurationDefault(member.joinedTimestamp)}`, false)
        .addField('Presence', presence, true)
        .setColor(color)
        .setThumbnail(target.displayAvatarURL({dynamic: true}))
        .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
        return message.channel.send(embed);
    }
}
