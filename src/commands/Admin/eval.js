/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const Discord = require('discord.js');
const Util = Discord.Util;
const { inspect } = require('util');
const { logAdmin } = require('../../dist/console');
const _funcs = require('../../dist/functions');

module.exports = {
    name: 'eval',
    guildOnly: true,
    modOnly: 1,
    async run(client, message, args) {
        if (!args.length) return client.errEmb('No Code Provided.', message);
        const path = `${message.guild.id}/${message.channel.id}`;
        let code = args.join(' ');
        if (/^`{3}(?:.+)?(?:\n+)?[\s\S]+(?:\n+)?`{3}$/gmi.test(code)) code = code.replace(/^```(?:[\S\n]+)?|```$/gmi, '');
        logAdmin('eval', path, message.author.id, code);
        if (/token|(client)?\.config|while\s*\(\s*true\s*\)\s*\{\s*\}/gi.test(code)) return client.errEmb('You Can\'t Do That.', message);
        try {
            let m;
            let evaled = (await eval(code));
            evaled = inspect(evaled, false, 0);
            if (evaled.length > 2000) {
                evaled = Util.splitMessage(evaled);
                evaled.forEach(async msg => await message.channel.send(`\`\`\`js\n${msg}\n\`\`\``));
            } else {
                m = await message.channel.send('```js\n'+ evaled +'\n```');
            }
            if (evaled instanceof Promise) {
                await evaled;
                return m.edit('```js\n'+ evaled +'\n```');
            }
        } catch (err) {
            return message.channel.send(`\`\`\`js\n${err}\n\`\`\``);
        }
    }
}
