require('discord.js');
const {inspect} = require('util');

module.exports = {
    name: 'eval',
    guildOnly: true,
    modOnly: true,
    run: async (client, message, args) => {
        if (!client.config.botOwners.includes(message.author.id)) return;
        if (args.length < 1) return message.channel.send('<:wtf_dude:789567331495968818>');
        const code = args.join(' ');
        try {
            const evaled = eval(code);
            const i = (s,d=0) => inspect(s,false,d);
            const m = await message.channel.send('```js\n'+ i(evaled).slice(0,1980) +'\n```');
            if(evaled instanceof Promise){
                await evaled;
                return m.edit('```js\n'+ i(evaled,1).slice(0,1980) +'\n```');
            }
        } catch (error) {
            message.channel.send(`\`\`\`js\n${error}\n\`\`\``);
        }
        console.log(`${message.guild.id}/${message.author.id}: Eval:\n${code}`);
    }
}
