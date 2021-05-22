module.exports = {
    name: 'dbupdate',
    description: 'Updates the database of a specified guild to the latest schema update.',
    usage: 'dbupdate <Guild:ID>',
    guildOnly: true,
    modOnly: 2,
    async run(client, message, args) {
        if (!args.length) return client.errEmb('No Guild Specified.\n```\ndbupdate <Guild:ID>\n```', message);
        const server = client.guilds.cache.get(args[0]);
        if (!server) return client.errEmb('Unknown Guild Specified.', message);
        try {
            await client.emit('guildDelete', server);
            await client.emit('guildCreate', server);
            return client.checkEmb(`Successfully Updated Database for Guild: \`${server.name}\`!`, message);
        } catch (err) {
            return client.errEmb(err.message, message);
        }
    }
}
