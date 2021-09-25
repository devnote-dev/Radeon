/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'fetchdb',
    aliases: ['getdb'],
    description: 'Fetches the GUILD database entry for a specified server.',
    usage: 'fetchdb <Guild:ID> <Database>',
    guildOnly: true,
    modOnly: 4,

    async run(client, message, args) {
        if (args.length < 2) return client.error('Insufficient Arguments\n\`\`\`\nfetchdb <Guild:ID> <Database>\n\`\`\`', message);
        let server = args.raw[0];
        let db = args.lower[1];
        if (server == 0) server = message.guild;
        else server = client.guilds.cache.get(server);
        if (!server) return client.error('Server not found!', message);
        if (!['guild', 'automod', 'muted', 'warns'].includes(db)) return client.error('Invalid database specified.', message);

        const data = await client.db(db).get(server.id);
        if (!data) return client.error(`Unknown: Failed getting ${db} database for that server.`, message);
        const embed = new MessageEmbed()
            .setTitle(`Server: ${server.name} <${db}>`)
            .setDescription(`\`\`\`js\n${data}\n\`\`\``)
            .setColor(0x1e143b);
        return message.channel.send({ embeds:[embed] });
    }
}
