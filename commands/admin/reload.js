/**
 * @author Devonte <https://github.com/devnote-dev>
 * @author Piter <https://github.com/piterxyz>
 * @copyright 2021 Radeon Development
 */

const log = require('../../log');

module.exports = {
    name: 'reload',
    aliases: ['rl'],
    description: 'Reloads a command into the client',
    usage: 'reload <Command:Name>',
    guildOnly: true,
    ownerOnly: 1,

    async run(client, message, args) {
        if (!args.length) return client.error(this, message);
        const cmd = client.commands.get(args.lower[0]) || client.commands.get(client.aliases.get(args.lower[0]));
        if (!cmd) return client.error('Unknown command specified.', message);

        try {
            delete require.cache[require.resolve(`../${cmd.cat}/${cmd.name}.js`)];
            client.commands.delete(cmd.name);
            const pull = require(`../${cmd.cat}/${cmd.name}.js`);
            pull.cat = cmd.cat;
            client.commands.set(pull.name, pull);
            return client.check(`Successfully reloaded command \`${pull.name}\`!`, message);
        } catch (err) {
            log.error(err, message, message.author.id);
            return client.error('Failed reloading command. Error logged on console.', message);
        }
    }
}
