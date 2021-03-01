const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'serverinfo',
    description: 'Sends information about the server.',
    guildOnly: true,
    run: async (client, message) => {
        message.channel.startTyping();
        const server = message.guild;
        const owner = server.owner;
        const tc = server.channels.cache.filter(c => c.type === 'text');
        const vc = server.channels.cache.filter(c => c.type === 'voice');
        const roles = server.roles.cache.size;
        const bots = server.members.cache.filter(m => m.user.bot);
        const an = server.emojis.cache.filter(e => e.animated);
        let acc;
        if (server.partnered) acc += '<:partner:812003146787192903> Partnered\n';
        if (server.verified) acc += '<:Verified:812004278566649907> Verified\n';
        switch (server.explicitContentFilter) {
            case 'DISABLED': ecfl = 'Disabled'; break;
            case 'MEMBERS_WITHOUT_ROLES': ecfl = 'Members Without Roles'; break;
            case 'ALL_MEMBERS': ecfl = 'All Members'; break;
            default: ecfl = 'Unknown'; break;
        }
        switch (server.premiumTier) {
            case 0: tier = 'None'; break;
            case 1: tier = 'Tier 1'; break;
            case 2: tier = 'Tier 2'; break;
            case 3: tier = 'Tier 3 (Max)'; break;
            default: tier = 'Unknown'; break;
        }
        function duration(ms) {
            const sec = Math.floor((ms / 1000) % 60).toString()
            const min = Math.floor((ms / (1000 * 60)) % 60).toString()
            const hrs = Math.floor((ms / (1000 * 60 * 60)) % 24).toString()
            const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString()
            return `${days.padStart(1, `0`)} days ${hrs.padStart(2, `0`)} hours ${min.padStart(2, `0`)} mins and ${sec.padStart(2, `0`)} seconds ago`;
        }
        const embed = new MessageEmbed()
        .setTitle(`Server: ${server.name}`)
        .setThumbnail(server.iconURL({dynamic: true}))
        .addField('Owner', `${owner}`, true)
        .addField('Members', `${server.memberCount} Total Members\n${server.memberCount - bots.size} Users\n${bots.size} Bots`, true)
        .addField('Created At', `${duration(server.createdAt)}`, true)
        .addField('Acknowledgements', `${acc ?? 'None'}`, true)
        .addField('Info', `Region: ${server.region}\nMFA: ${server.mfaLevel}\nContent Filter: ${ecfl}`, true)
        .addField('General', `${tc.size} Text Channels\n${vc.size} Voice Channels\n${roles} Roles`, true)
        .addField('Emojis', `${server.emojis.cache.size} Total Emojis\n${server.emojis.cache.size - an.size} Default\n ${an.size} Animated`, true)
        .addField('Premium (Boosts)', tier, true)
        .setColor(message.member.roles.highest.hexColor)
        .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
        setTimeout(async () => {
            await message.channel.stopTyping()
            message.channel.send(embed)
        }, 2000);
    }
}
