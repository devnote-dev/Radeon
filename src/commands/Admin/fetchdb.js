/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'fetchdb',
    aliases: ['getdb'],
    description: 'Fetches the GUILD database entry for a specified server.',
    usage: 'fetchdb [Guild:ID] [Database:Text]',
    guildOnly: true,
    modOnly: 4,
    async run(client, message, args) {
        let server = message.guild, db = 'guild';
        if (args.length) server = client.guilds.cache.get(args.raw[0]);
        if (!server) return client.errEmb('Unknown Server Specified.', message);
        if (args.lower[1]) db = args.lower[1];
        if (!['guild', 'muted', 'warnings'].includes(db)) return client.errEmb('Unknown Database Specified.', message);
        const data = await client.db(db).get(server.id);
        if (!data) return client.errEmb(`Database entry for \`${server.name}\` could not be found!`, message);
        const embed = new MessageEmbed()
            .setTitle(`Guild: ${server.name}`)
            .setDescription(`\`\`\`js\n${data}\n\`\`\``)
            .setColor(0x1e143b);
        return message.channel.send({ embeds: [embed] });
    }
}
