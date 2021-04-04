const { MessageEmbed } = require('discord.js');
const Warns = require('../../schemas/warn-schema');

module.exports = {
    name: 'warn',
    tag: 'Warns a specified user',
    description: 'Warns a specified user.',
    usage: 'warn <User:Mention/ID> <Reason:Text>',
    userPerms: 8192,
    guildOnly: true,
    run: async (client, message, args) => {
        if (!args.length) return client.errEmb('Insufficient Arguments.\n```\nwarn <User:Mention/ID> <Reason:Text>\n```', message);
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) return client.errEmb('Invalid Member Specified.', message);
        if (!args[1]) return client.errEmb('No Reason Specified.', message);
        const reason = args.slice(1).join(' ');
        try {
            await Warns.findOneAndUpdate(
                { guildID: message.guild.id },
                { $set:{ userid: target.user.id, reason: reason, mod: message.author.id, date: new Date() }}
            );
            const dmEmb = new MessageEmbed()
            .setTitle('You have been Warned!')
            .setDescription(`**Reason:** ${reason}`)
            .setColor(0x1e143b).setFooter(`Sent from ${message.guild.name}`, message.guild.iconURL({dynamic: true}))
            .setTimestamp();
            let sent = false;
            try {
                target.user.send(dmEmb);
                sent = true;
            } catch {}
            if (sent) {
                return client.checkEmb(`${target.user.tag} was warned!`, message);
            } else {
                return client.checkEmb(`Warning logged for ${target.user.tag}! (DMs were unavailable).`, message);
            }
        } catch {
            return client.errEmb('Unknown: Failed Warning Member. Try again later.', message);
        }
    }
}