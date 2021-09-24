/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');
const { logs } = require('../../config.json');
const log = require('../log');

exports.run = (client, ratelimit) => {
    const e = new MessageEmbed()
        .setTitle('RateLimit Warning')
        .addFields(
            {name: 'Timeout', value: `${ratelimit.timeout}ms`, inline: true},
            {name: 'Limit', value: `${ratelimit.limit}`, inline: true},
            {name: 'Method', value: ratelimit.method, inline: true},
            {name: 'Path', value: `\`\`\`\n${ratelimit.path}\n\`\`\``, inline: false},
            {name: 'Source (Route)', value: `\`\`\`\n${ratelimit.route}\n\`\`\``, inline: false}
        )
        .setTimestamp();
    client.channels.cache.get(logs.error).send({ embeds:[e] })
    .catch(() => {
        log.error(`Ratelimit
        Limit: ${ratelimit.limit}
        Method: ${ratelimit.method}
        Source: ${ratelimit.source}
        `, ratelimit.path);
    });
}
