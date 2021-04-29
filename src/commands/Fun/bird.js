const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch')

module.exports = {
    name: 'bird',
    aliases: ['birb'],
    tag: 'Bird image and fact',
    description: 'Bird image and fact',
    usage: 'Bird [image|fact]',
    cooldown: 5,
    run: async (client, message, args) => {

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
        .setTitle("Birf")
        if (fox.fact) embed.setDescription(fox.fact)
        if (fox.image && fox.fact) {
            embed.setThumbnail(fox.image)
        } else {
            embed.setImage(fox.image)
        }
        return message.reply(embed)

        // just make them functions, keep it clean
        async function getFact() {
            return await request.get('https://some-random-api.ml/facts/bird').then(response => response.body.fact);
        }
        async function getImage() {
            return await request.get('https://some-random-api.ml/img/bird').then(response => response.body.link);
        }
    }
}