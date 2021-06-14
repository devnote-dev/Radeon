/**
 * @author Crenshaw <https://github.com/Crenshaw1312>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch')

module.exports = {
    name: 'fox',
    tag: 'Fox image and fact',
    description: 'Fox image and fact',
    usage: 'Fox [image|fact]',
    cooldown: 5,
    async run(client, message, args) {

        let fox = {}
        switch (args[0] || null) {
            case "img":
            case "pic":
            case "image":
            case "picture":
                fox.image = await getImage()
                break
            case "f":
            case "fact":
                fox.fact = await getFact()
                break
            default:
                fox.image = await getImage()
                fox.fact = await getFact()
                break
        }
        
        // embed
        const embed = new MessageEmbed()
        .setColor(0x1e143b)
        .setTitle("Fox")
        if (fox.fact) embed.setDescription(fox.fact)
        if (fox.image && fox.fact) {
            embed.setThumbnail(fox.image)
        } else {
            embed.setImage(fox.image)
        }
        return message.reply(embed)

        // just make them functions, keep it clean
        async function getFact() {
            return await request.get("https://some-random-api.ml/facts/fox").then(response => response.body.fact);
        }
        async function getImage() {
            return await request.get("https://randomfox.ca/floof/").then(response => response.body.image);
        }
    }
}