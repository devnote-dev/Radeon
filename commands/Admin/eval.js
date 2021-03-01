require('discord.js');
const {inspect} = require('util');

module.exports = {
    name: 'eval',
    guildOnly: true,
    modOnly: 'void',
    run: async (client, message, args) => {
        if (args.length < 1) return client.errEmb('No Code Provided.', message);
        let code = args.join(' ');
        if (/token|(client)?\.config/gi.test(code)) return client.errEmb('You Can\'t Do That.', message);
        if (/^`{3}(?:.+)?\n*?[\s\S]+\n*`{3}$/gmi.test(code)) code = code.replace(/^`{3}(?:.+)?\n|\n?`{3}$/gmi, '');
        try {
            const evaled = await eval(code);
            const i = (s,d=0) => inspect(s,false,d);
            const m = await message.channel.send('```js\n'+ i(evaled).slice(0,1980) +'\n```');
            if(evaled instanceof Promise){
                await evaled;
                return m.edit('```js\n'+ i(evaled,1).slice(0,1980) +'\n```');
            }
        } catch (error) {
            message.channel.send(`\`\`\`js\n${error}\n\`\`\``);
        }
        console.log(`\n${message.guild.id}/${message.author.id}: Eval:\n${code}\n`);
    }
}
