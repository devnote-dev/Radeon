/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const Discord = require('discord.js');
const { Util } = Discord;
const { inspect } = require('util');
const { logAdmin } = require('../../dist/console');
const _funcs = require('../../dist/functions');

module.exports = {
    name: 'eval',
    guildOnly: true,
    modOnly: 1,
    async run(client, message, args) {
        const { author, member, channel, guild } = message;
        if (!args.length) return client.errEmb('No Code Provided.', message);
        const path = `${guild.id}/${channel.id}`;
        let code = args.join(' ');
        if (/^`{3}(?:.+)?(?:\n+)?[\s\S]+(?:\n+)?`{3}$/gmi.test(code)) code = code.replace(/^```(?:[\S\n]+)?|```$/gmi, '');
        logAdmin('eval', path, author.id, code);
        if (/token|(client)?\.config|while\s*\(\s*true\s*\)\s*\{\s*\}/gi.test(code)) return client.errEmb('You Can\'t Do That.', message);
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
                evaled.forEach(async m => {
                    await channel.send(`\`\`\`js\n${m}\n\`\`\``);
                    await new Promise(res => setTimeout(res, 750));
                });
            } else {
                channel.send(`\`\`\`js\n${evaled}\n\`\`\``);
            }
        } catch (err) {
            return channel.send(`\`\`\`js\n${err}\n\`\`\``);
        }
    }
}
