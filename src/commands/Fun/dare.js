/**
 * @author Crenshaw <https://github.com/Crenshaw1312>
 * @copyright Radeon Development 2021
 */

const { choose } = require('../../dist/functions');
const request = require('node-superfetch')
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'dare',
    tag: 'Returns a random dare.',
    description: 'Returns a random dare',
    usage: 'dare [pg|pg13|r] [d|irls]',
    cooldown: 5,
    async run(client, message, args) {
        // setting rating
        let rating = await choose(args, ["pg", "pg13", "r"], null);
        let type = choose(args, ["d", "irl"], rating);

        let dare = (await request.get(`https://api.truthordarebot.xyz/dare?rating=${rating}&type=${type}`).then(response => response.body)).question;
        if (!dare)return client.errEmb("No dare was returned, try again or get support", message);

        const embed = new MessageEmbed()
        .setTitle("Dare")
        .setColor(0x1e143b)
        .setFooter(`Rating: ${rating} - Type: ${type}`)
        .setDescription(dare);
        return message.reply({ embeds: [embed] });
    }
}