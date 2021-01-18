const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
    if (message.author.bot || !message.content.startsWith(client.config.prefix)) return;

    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return;
    
    let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    if (!command) return;
    if (!message.guild && command.guildOnly) return message.channel.send(client.errEmb('This command cant be used in DMs.'));
    
    if(command.permissions) {
        if(message.member.permissions.has(command.permissions)) {
            command.run(client, message, args);
        } else {
            const embed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
            .setDescription(`You are missing \`${command.permissions.map(p => p.replace(/_/g, ' ')).join(', ')}\` permission(s).`)
            .setColor(message.member.displayHexColor)
            message.channel.send(embed)
        }
    } else {
        command.run(client, message, args);
    }
    
    if (message.channel.type === "dm") {
    if (message.author.id === client.user.id) return;
    const Log = new MessageEmbed()
        .setTitle("📂 DMS LOGS")
        .addField(`Message Author`, `<@${message.author.id}>\n\`${message.author.id}\``)
        .addField(`Message`, `${message.content}`)
        client.channels.cache.get("800776299035361330").send(Log)
    }
}
