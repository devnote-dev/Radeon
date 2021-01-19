const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'shutdown',
    description: 'Shuts down existing instances of Radeon. Note: this may result in the Client restarting if the host is operating off Batch File.',
    guildOnly: true,
    modOnly: true,
    run: async (client, message) => {
        if (!client.config.botOwners.includes(message.author.id)) return;
        await message.react('a:loading:786661451385274368');
        const e = new MessageEmbed()
        .setDescription(`Radeon is shutting down\nHost: Unknown`)
        .setColor(0xd10000)
        .setTimestamp();
        await client.channels.cache.get(client.config.logs.status).send(e);
        process.exit(0);
    }
}
