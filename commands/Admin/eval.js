const Discord = require('discord.js');
const Util = Discord.Util;
const { inspect } = require('util');
const { logAdmin } = require('../../console/consoleR');

module.exports = {
    name: 'eval',
    guildOnly: true,
    modOnly: 1,
    run: async (client, message, args) => {
        if (!args.length) return client.errEmb('No Code Provided.', message);
        const path = `${message.guild.id}/${message.channel.id}`;
        let code = args.join(' ');
        if (/^`{3}(?:.+)?(?:\n+)?[\s\S]+(?:\n+)?`{3}$/gmi.test(code)) code = code.replace(/^```(?:[\S\n]+)?|```$/gmi, '');
        logAdmin('eval', path, message.author.id, code);
        if (/token|(client)?\.config|while\s*\(\s*true\s*\)\s*\{\s*\}/gi.test(code)) return client.errEmb('You Can\'t Do That.', message);
        try {
            let m;
            let evaled = await eval(code);
            const i = (s,d=0) => inspect(s,false,d);
            evaled = i(evaled);
            if (evaled.length > 2000) {
                evaled = Util.splitMessage(evaled);
                evaled.forEach(async msg => await message.channel.send(`\`\`\`js\n${msg}\n\`\`\``));
            } else {
                m = await message.channel.send('```js\n'+ i(evaled) +'\n```');
            }
            if (evaled instanceof Promise) {
                await evaled;
                return m.edit('```js\n'+ i(evaled,1).slice(0,1980) +'\n```');
            }
        } catch (error) {
            return message.channel.send(`\`\`\`js\n${error}\n\`\`\``);
        }
    }
}
