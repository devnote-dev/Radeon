/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const Discord = require('discord.js');
const { Util } = Discord;
const { inspect } = require('util');
const { logAdmin } = require('../../dist/console');
const funcs = require('../../dist/functions');

module.exports = {
    name: 'eval',
    guildOnly: true,
    modOnly: 1,
    async run(client, message, args) {
        const { author, member, channel, guild } = message;
        if (!args.length) return client.errEmb('No Code Provided.', message);
        const _path = `${guild.id}/${channel.id}`;
        let code = args.raw.join(' ');
        if (/^`{3}(?:.+)?(?:\n+)?[\s\S]+(?:\n+)?`{3}$/gmi.test(code)) code = code.replace(/^```(?:[\S\n]+)?|```$/gmi, '');
        logAdmin('eval', _path, author.id, code);
        if (/while\s*\(\s*true\s*\)\s*\{\s*\}/gi.test(code)) return client.errEmb('Cannot execute infinite loop.', message);
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
