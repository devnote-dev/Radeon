/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

module.exports = {
    name: 'leaveserver',
    description: 'Forces Radeon out of a specified server.',
    usage: 'leaveserver <Guild:ID>',
    modOnly: 2,
    async run(client, message, args) {
        if (!args.length) return client.error('No Guild Specified.', message);
        const server = client.guilds.cache.get(args.raw[0]);
        if (!server) return client.error('Unknown Guild Specified.');
        await server.leave();
        return client.check(`Successfully left server \`${server.name}\`\nDatabases will be updated.`, message);
    }
}
