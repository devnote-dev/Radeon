/**
 * @author Crenshaw <https://github.com/Crenshaw1312>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');
const options = [
    "It is certain", "Without a doubt", "You may rely on it",
    "Yes definitely", "It is decidedly so", "As I see it, yes",
    "Most likely", "Yes", "Outlook good", "Signs point to yes",
    "Reply hazy try again", "Better not tell you now", "Ask again later",
    "Cannot predict now", "Concentrate and ask again", "Don’t count on it",
    "Outlook not so good", "My sources say no", "Very doubtful", "My reply is no"
];

module.exports = {
    name: '8ball',
    aliases: ['8b'],
    tag: 'Ask, and thy shall recieve.',
    description: 'It\'s an 8ball, what do you expect?',
    usage: '8ball <question>',
    cooldown: 3,
    appdata:{
        name: '8ball',
        description: 'Ask, and thy shall recieve.',
        options:[{
            name: 'input',
            type: 'STRING',
            description: 'your question',
            required: true
        }]
    },
    async run(client, message, args) {
        if (!args.length) return client.errEmb("Please provide a question", message);
        const random = options[Math.floor(Math.random() * options.length)];
        const embed = new MessageEmbed()
        .setTitle('8Ball')
        .setColor(0x1e143b);
        embed.setDescription(random);

        return message.reply({ embeds:[embed] });
    }
}

module.exports.appres = async (_, int) => {
    await int.defer();
    const random = options[Math.floor(Math.random() * options.length)];
    const embed = new MessageEmbed()
        .setTitle('8Ball')
        .setDescription(random)
        .setColor(0x1e143b);
    return int.reply({ embeds:[embed] });
}
