require('discord.js');

module.exports = {
    name: 'leaveserver',
    description: 'Forces Radeon out of a specified server.',
    usage: 'leaveserver <Guild:ID>',
    modOnly: 'warn',
    run: async (client, message, args) => {
        if (args.length < 1) return client.errEmb('No Guild Specified.', message);
        const server = client.guilds.cache.get(args[0]);
        if (!server) return client.errEmb('Unknown Guild Specified.');
        await server.leave();
        client.checkEmb(`Successfully Left Guild: \`${server.name}\`\nDatabases will be updated.`, message);
    }
}
