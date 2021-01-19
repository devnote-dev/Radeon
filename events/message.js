const {MessageEmbed} = require('discord.js');
const guild = require('../schemas/guild-schema');

exports.run = async (client, message) => {
    if (message.author.bot) return;
    
    const data = await guild.findOne({
        guildID: message.guild.id
    }), (err, guild) => {
        if (err) console.error(err)
        if (!guild) {
            const newGuild = new Guild({
                guildID: message.guild.id,
                prefix: client.config.prefix,
                ignoredChannels: [],
                ignoredCommands: []
            })

            newGuild.save()
        }});
    
    const prefix = data.prefix
    
    if (/^<@!?762359941121048616>(?:\s+prefix)?$/gi.test(message.content)) {
        return message.channel.send({embed:{description:`Current Prefix: \`${prefix}\`\n\nDefault Prefix: \`r!\``,color:0x1e143b}});
    }
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
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
}
