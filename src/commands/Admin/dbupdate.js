/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

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
            const G = client.db('guild'), M = client.db('muted'), W = client.db('warns');
            await G.delete(server.id);
            await M.delete(server.id);
            await W.delete(server.id);
            await G.create(server.id, null);
            await M.create(server.id, { guildID: server.id });
            await W.create(server.id, { guildID: server.id });
            return client.checkEmb(`Successfully Updated Database for Guild: \`${server.name}\`!`, message);
        } catch (err) {
            return client.errEmb(err.message, message);
        }
    }
}
