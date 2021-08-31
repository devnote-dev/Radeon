/**
 * @author Crenshaw <https://github.com/Crenshaw1312>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch')

module.exports = {
    name: 'bird',
    aliases: ['birb'],
    tag: 'Bird image and fact',
    description: 'Bird image and fact',
    usage: 'Bird [image|fact]',
    cooldown: 5,
    appdata:{
        name: 'bird',
        description: 'Bird image and fact',
        options:[
            {
                name: 'image',
                type: 'BOOLEAN',
                description: 'send a bird image only',
                required: false
            },
            {
                name: 'fact',
                type: 'BOOLEAN',
                description: 'send a bird fact only',
                required: false
            }
        ]
    },
    async run(_, message, args) {

        let fox = {}
        switch (args.lower[0] || null) {
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
        .setTitle("Bird")
        if (fox.fact) embed.setDescription(fox.fact)
        if (fox.image && fox.fact) {
            embed.setThumbnail(fox.image)
        } else {
            embed.setImage(fox.image)
        }
        return message.reply({ embeds:[embed] });

        // just make them functions, keep it clean
    }
}

async function getFact() {
    return await request.get('https://some-random-api.ml/facts/bird').then(response => response.body.fact);
}
async function getImage() {
    return await request.get('https://some-random-api.ml/img/bird').then(response => response.body.link);
}

module.exports.appres = (_, int) => {
    await int.defer();
    let fox = {};
    if (int.options[0]) {
        if (int.options[0].name === 'image') {
            fox.image = getImage();
        } else {
            fox.fact = getFact();
        }
    } else {
        fox.image = getImage();
        fox.fact = getFact();
    }
    const embed = new MessageEmbed()
        .setColor(0x1e143b)
        .setTitle("Bird");
    if (fox.fact) embed.setDescription(fox.fact)
    if (fox.image && fox.fact) {
        embed.setThumbnail(fox.image)
    } else {
        embed.setImage(fox.image)
    }
    return int.reply({ embeds:[embed] });
}
