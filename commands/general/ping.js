/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @author Piter <https://github.com/piterxyz>
 * @copyright 2021 Radeon Development
 */

module.exports = {
    name: 'ping',
    tag: 'Sends Radeon\'s ping',
    description: 'Sends Radeon\'s ping'
}

exports.run = async (client, message) => {
    const msg = await message.channel.send({
        embeds:[{
            thumbnail:{
                url: 'https://cdn.discordapp.com/emojis/786661451385274368.gif?v=1'
            },
            color: client.const.col.def
        }]
    });
    msg.edit({
        embeds:[{
            title: '🏓 Pong!',
            description: `Websocket: ${client.ws.ping}ms\nAPI: ${msg.createdTimestamp - message.createdTimestamp}ms`,
            color: client.const.col.def
        }]
    });
}
