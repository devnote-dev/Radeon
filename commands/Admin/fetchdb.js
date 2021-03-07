const { MessageEmbed } = require('discord.js');
const Guild = require('../../schemas/guild-schema');

module.exports = {
    name: 'fetchdb',
    description: 'Fetches the GUILD database entry for a specified server.',
    usage: 'fetchdb <Guild:ID>',
    guildOnly: true,
    modOnly: 'warn',
    run: async (client, message, args) => {
        if (!args.length) return client.errEmb('No Guild Specified.\n```\nfetchdb <Guild:ID>\n```', message);
        const server = client.guilds.cache.get(args[0]);
        if (!server) return client.errEmb('Unknown Guild Specified.', message);
        const data = await Guild.findOne({guildID: server.id});
        if (!data) return client.errEmb(`Database entry for \`${server.name}\` could not be found!`, message);
        const embed = new MessageEmbed()
        .setTitle(`Guild: ${server.name}`)
        .setDescription(`\`\`\`js\n${data}\n\`\`\``)
        .setColor(0x1e143b);
        return message.channel.send(embed);
    }
}
