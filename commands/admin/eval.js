/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */

const Discord = require('discord.js');
const {
    Util,
    Permissions,
    MessageEmbed,
    MessageAttachment
} = Discord;
const { inspect } = require('util');

const noop = () => {};

module.exports = {
    name: 'eval',
    guildOnly: true,
    ownerOnly: 2,

    async run(client, message, args) {
        const { author, member, channel, guild } = message;
        if (!args.length) return client.error('No Code Provided.', message);
        let code = args.raw.join(' ');
        if (/^`{3}(?:.+)?(?:\n+)?[\s\S]+(?:\n+)?`{3}$/gmi.test(code)) code = code.replace(/^```(?:[\S\n]+)?|```$/gmi, '');
        if (/while\s*\(\s*true\s*\)\s*\{\s*\}/gi.test(code)) return client.error('Cannot execute infinite loop.', message);
        try {
            let evaled;
            if (code.includes('await')) {
                evaled = await eval(`(async () => { ${code} })();`);
            } else {
                evaled = await eval(code);
            }
            evaled = inspect(evaled, false, 0);
            if (evaled.length > 2000) {
                evaled = Util.splitMessage(evaled);
                return evaled.forEach(async m => {
                    await channel.send(`\`\`\`js\n${m}\n\`\`\``);
                    await new Promise(res => setTimeout(res, 750));
                });
            } else {
                return channel.send(`\`\`\`js\n${evaled}\n\`\`\``);
            }
        } catch (err) {
            return channel.send(`\`\`\`js\n${err}\n\`\`\``);
        }
    }
}
