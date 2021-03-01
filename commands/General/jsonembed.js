require('discord.js');

module.exports = {
    name: 'jsonembed',
    aliases: ['jsonemb','jsemb'],
    description: 'Creates an embed using JSON string.',
    usage: 'jsonembed <JSON:Text>\n\njsonembed { "title":"hi", "description":"hello" }',
    guildOnly: true,
    run: async (client, message, args) => {
        if (!args.length) return client.errEmb('No JSON Provided.\n```\njsonembed <JSON:Text>\n```', message);
        try {
            const embed = JSON.parse(args.join());
            message.channel.send({embed:embed});
        } catch (err) {
            client.errEmb(err.message, message);
        }
    }
}
