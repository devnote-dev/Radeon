/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { logAdmin } = require('../../dist/console');

module.exports = {
    name: 'execute',
    aliases: ['exec'],
    description: 'Executes a specified command. Arguments are also taken into account.',
    usage: 'execute <Command:Name/Alias> [...args]',
    guildOnly: true,
    modOnly: 4,
    async run(client, message, args) {
        if (!args.length) return client.errEmb('No Command Specified.', message);
        const path = `${message.guild.id}/${message.channel.id}`;
        const cmd = args[0].toLowerCase();
        const ARGS = args.slice(1);
        if (cmd === 'execute' || cmd === 'exec') return message.react('❌').catch(()=>{});
        let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
        if (!command) return client.errEmb(`Unknown Command \`${cmd}\``, message);
        logAdmin('exec', path, message.author.id, command.name +' '+ ARGS.join(' '));
        try {
            await command.run(client, message, ARGS);
        } catch (err) {
            return client.errEmb(err.message, message);
        }
    }
}
