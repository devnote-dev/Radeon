exports.run = async (client, message) => {
    if (message.author.bot || !message.guild || !message.content.startsWith(client.config.prefix)) return;

    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return;
    
    let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    if (!command) return;
    
    if(command.permissions) {
        if(message.member.permissions.has(command.permissions)) {
            command.run(client, message, args);
        } else {
            message.reply('Missing permissions.')
        }
    } else {
        command.run(client, message, args);
    }
}
