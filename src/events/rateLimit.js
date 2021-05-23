/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');
const { logError } = require('../console/consoleR');

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
    client.channels.cache.get(client.config.logs.error).send(e).catch(() => {
        logError(`Ratelimit
        Limit: ${rateLimitInfo.limit}
        Method: ${rateLimitInfo.method}
        Source: ${rateLimitInfo.source}
        `, rateLimitInfo.path);
    });
}
