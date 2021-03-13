require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Sends Radeon\'s ping.',
    run: async (client, message) => {
        const msg = await message.channel.send({embed:{color:0x1e143b,thumbnail:{url:'https://cdn.discordapp.com/emojis/786661451385274368.gif?v=1'}}});
        return msg.edit({embed:{title:'🏓 Pong!',description:`Websocket: ${client.ws.ping}ms\nAPI: ${msg.createdTimestamp - message.createdTimestamp}ms`,color:0x1e143b}});
    }
}
