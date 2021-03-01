const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'userinfo',
    aliases: ['whois'],
    description: 'Sends information about a specified user, or the triggering user if none is specified.',
    usage: 'userinfo [User:Mention/ID]',
    guildOnly: true,
    run: async (client, message, args) => {
        let target = message.author;
        if (args.length) target = message.mentions.users.first() || message.guild.member(args[0]).user;
        if (!target) return client.errEmb('Invalid Member Specified.', message);
        const member = message.guild.member(target);
        let color = member.roles.cache.find(r => r.hexColor != '#000000').hexColor;
        if (!color) color = 0x2f3136;
        let presence = 'None or not cached.';
        if (target.presence.activities.length) {
            presence = '';
            target.presence.activities.forEach(act => {
                if (act.type === 'CUSTOM_STATUS') presence += 'Custom: '+ act.state +'\n';
                if (act.type === 'PLAYING') presence += '🎮 playing: '+ act.name +'\n';
                if (act.type === 'LISTENING') {
                    let em = '🎧';
                    if (act.name == 'Spotify') em = '<:Spotify:815659926637903883>';
                    presence += `${em} ${act.details} - ${act.state}\n`;
                }
                if (act.type === 'WATCHING') presence += '📺 watching: '+ act.name +'\n';
            });
            if (!presence.length) presence = 'Unknown Activity';
        }
        let totalf = '';
        const flags = {
            'HOUSE_BRAVERY': '<:hypesquad_bravery:815679606656204831>',
            'HOUSE_BRILLIANCE': '<:hypesquad_brilliance:815679606404546621>',
            'HOUSE_BALANCE': '<:hypesquad_balance:815679606702735420>',
            'HYPESQUAD_EVENTS': '<:hypesquad_events:815697633141981235>'
        }
        target.flags.toArray().forEach(f => { if (flags[f]) totalf += flags[f] +' ' });
        if (member.premiumSince) totalf += ' <:boost_tier:789702536730509333>';
        function duration(ms) {
            const sec = Math.floor((ms / 1000) % 60).toString()
            const min = Math.floor((ms / (1000 * 60)) % 60).toString()
            const hrs = Math.floor((ms / (1000 * 60 * 60)) % 24).toString()
            const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString()
            return `${days.padStart(1, `0`)} days ${hrs.padStart(2, `0`)} hours ${min.padStart(2, `0`)} mins and ${sec.padStart(2, `0`)} seconds ago`;
        }
        const embed = new MessageEmbed()
        .setTitle(target.tag)
        .setDescription(totalf)
        .addField('ID', `${target.id}`, true)
        .addField('Avatar', `[Download Link 📥](${target.avatarURL({dynamic: true})})`, true)
        .addField('Account Age', `${(new Date(target.createdTimestamp)).toDateString()}\n${duration(target.createdTimestamp)}`, false)
        .addField('Server Member Age', `${(new Date(member.joinedTimestamp)).toDateString()}\n${duration(member.joinedTimestamp)}`, false)
        .addField('Presence', presence, true)
        .addField('Past Names', '```\nnull\n```', false)
        .setColor(color)
        .setThumbnail(target.displayAvatarURL({dynamic: true}))
        .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
        message.channel.send(embed);
    }
}
