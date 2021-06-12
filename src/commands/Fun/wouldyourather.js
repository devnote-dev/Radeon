/**
 * @author Crenshaw <https://github.com/Crenshaw1312>
 * @copyright Radeon Development 2021
 */


const { choose } = require('../../dist/functions');
const request = require('node-superfetch')
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'wouldyourather',
    aliases: ['wyr'],
    tag: 'Returns a random would you rather question.',
    description: 'Returns a random would you rather question',
    usage: 'wouldyourather [pg|pg13|r]',
    cooldown: 5,
    async run(client, message, args) {
        // setting rating
        let rating = await choose(args, ["pg", "pg13", "r"], null);

        let wyr = (await request.get(`https://api.truthordarebot.xyz/wyr?rating=${rating}`).then(response => response.body)).question;

        if (!wyr)return client.errEmb("No would you rather was returned, try again or get support", message);

        const embed = new MessageEmbed()
        .setTitle("Would You Rather")
        .setColor(0x1e143b)
        .setFooter(`Rating: ${rating}`)
        .setDescription(wyr.replace("Would you rather ", ""));
        return message.reply(embed);
    }
}