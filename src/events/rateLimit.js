const { MessageEmbed } = require('discord.js');

exports.run = async (client, rateLimitInfo) => {
    const e = new MessageEmbed()
    .setTitle('RateLimit Warn')
    .addFields(
        {name: 'Timeout', value: `${rateLimitInfo.timeout}ms`, inline: true},
        {name: 'Limit', value: `${rateLimitInfo.limit}`, inline: true},
        {name: 'Method', value: rateLimitInfo.method, inline: true},
        {name: 'Path', value: `\`\`\`\n${rateLimitInfo.path}\n\`\`\``, inline: false},
        {name: 'Source (Route)', value: `\`\`\`\n${rateLimitInfo.route}\n\`\`\``, inline: false}
    )
    .setTimestamp();
    client.channels.cache.get(client.config.logs.error).send(e).catch(console.error);
}
