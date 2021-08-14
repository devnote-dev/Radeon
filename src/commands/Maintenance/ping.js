/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @author Piter <https://github.com/piterxyz>
 * @copyright Radeon Development 2021
 */

module.exports = {
    name: 'ping',
    tag: 'Sends Radeon\'s ping!',
    description: 'Sends Radeon\'s ping!',
    appdata:{
        name: 'ping',
        description: 'Sends Radeon\'s ping!'
    },
    async run(client, message) {
        const msg = await message.channel.send({ embeds:[ {color:0x1e143b,thumbnail:{url:'https://cdn.discordapp.com/emojis/786661451385274368.gif?v=1'}} ]});
        return msg.edit({embeds:[{title:'🏓 Pong!',description:`Websocket: ${client.ws.ping}ms\nAPI: ${msg.createdTimestamp - message.createdTimestamp}ms`,color:0x1e143b}]});
    }
}

module.exports.appres = (client, int) => {
    return int.reply(`🏓 Pong!\nWS: ${client.ws.ping}ms`, { ephemeral: true });
}
