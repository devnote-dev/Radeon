const { MessageEmbed } = require('discord.js')
const { toDurationDefault } = require('../../functions/functions');

module.exports = {
    name: 'finduser',
    aliases: ['find-user'],
    description: 'Fetches a user globally.',
    usage: 'finduser <User:Name/Mention/ID>',
    guildOnly: false,
    modOnly: 'warn',
    run: async (client, message, args) => {
        if (!args.length) return client.errEmb('No User Specified\n```\nfinduser <User:Name/Mention/ID>\n```', message);
        message.channel.startTyping();
        const q = args.join(' ');
        let user = message.mentions.users.first()
        || client.users.cache.get(q)
        || client.users.cache.find(u => u.username.toLowerCase() == q.toLowerCase());

        if (!user) {
            message.channel.stopTyping();
            if (/\D+/g.test(q)) return client.errEmb('User Not Found. Try using ID for API fetch.', message);
            try {
                user = await client.users.fetch(q, true);
                if (!user) return client.errEmb('User is not available.', message);
            } catch (err) {
                console.log(err.message);
                return client.errEmb('User is not available.', message);
            }
        }

        const mutuals = client.guilds.cache
        .filter(g => g.members.cache.has(user.id))
        .map(g => `${g.id} - ${g.name}`)
        .join('\n');

        const embed = new MessageEmbed()
        .setTitle(`Fetched: ${user.tag}`)
        .addField('ID', `${user.id}`, true)
        .addField('Avatar', `[Download Link 📥](${user.displayAvatarURL({dynamic: true})})`, true)
        .addField('Account Age', toDurationDefault(user.createdTimestamp), false)
        .addField('Mutuals', `\`\`\`\n${mutuals}\n\`\`\``, false)
        .setColor(0x1e143b)
        .setThumbnail(user.displayAvatarURL({dynamic: true}))
        .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
        setTimeout(() => {
            message.channel.stopTyping()
            return message.channel.send(embed)
        }, 2000);
    }
}