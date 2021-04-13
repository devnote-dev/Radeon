require('discord.js');

module.exports = {
    name: 'shutdown',
    aliases: ['restart'],
    description: 'Shuts down existing instances of Radeon. Note: this may result in the Client restarting if the host is operating off Batch File.',
    guildOnly: true,
    modOnly: 1,
    run: async (client, message) => {
        await message.react('a:loading:786661451385274368').catch(()=>{});
        return process.exit(0);
    }
}
