require('discord.js');

module.exports = {
    name: 'execute',
    aliases: ['exec'],
    description: 'Executes a specified command. Arguments are also taken into account.',
    usage: 'execute <Command:Name/Alias> [...args]',
    guildOnly: true,
    modOnly: 'warn',
    run: async (client, message, args) => {
        if (args.length < 1) return client.errEmb('No Command Specified.', message);
        const cmd = args[0].toLowerCase();
        const Args = args.splice(1);
        if (cmd === 'execute' || cmd === 'exec') return message.react('❌').catch(()=>{});
        let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
        if (!command) return client.errEmb(`Unknown Command \`${cmd}\``, message);
        try {
            command.run(client, message, Args);
        } catch (err) {
            return client.errEmb(err.message, message);
        }
    }
}
