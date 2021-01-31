const Discord = require('discord.js')

module.exports = {
    name: 'finduser',
    aliases: ['find-user'],
    description: 'Sets bot\'s status.',
    guildOnly: false,
    modOnly: true,
    run: async (client, message, args) => { 
        if(args[0]) {
            const user = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.find(u => u.username == args.slice(0).join(" "));
            const mutual = client.guilds.cache.filter(g => g.members.cache.get(user.id)).map(g => `${g.name} - ${g.id}`).join('\n')
            
            if(user) {
                const embed = new Discord.MessageEmbed()
                .setAuthor(user.tag, user.displayAvatarURL({dynamic: true}))
                .addFields(
                    {name: 'ID:', value: `${user.id}`, inline: true},
                    {name: 'Mutual servers:', value: mutual, inline: true},
                )
                message.channel.send(embed)
            } else {
                message.channel.send(client.errEmb(`I can't find this user!`))
            }
        } else {
            message.channel.send(client.errEmb(`Correct usage: \`-finduser <user : mention | name | id>\``))
        }
    }
}
