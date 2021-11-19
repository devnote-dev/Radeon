/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */

const log = require('../../log');

module.exports = {
    name: 'toggle',
    description: 'Toggles commands and events.',
    usage: 'toggle <subcommand> [options]',
    ownerOnly: 1,

    async run(client, message, args) {
        if (!args.length) return client.error(this, message);
        const sub = args.lower[0];
        if (!['cmd', 'event'].includes(sub)) return client.error('Unknown toggle subcommand.', message);

        if (sub === 'cmd') {
            if (!args.lower[1]) return client.error('Missing command or category.', message);
            let cat, cmd;
            if (args.lower[2]) {
                cat = args.lower[2];
                cmd = args.lower[1];
            } else {
                cmd = args.lower[1];
            }
            if (!cat) {
                const command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
                if (!command) return client.error('Unknown command specified.', message);
                try {
                    delete require.cache[require.resolve(`./${command.cat}/${command.name}.js`)];
                    client.commands.delete(command.name);
                    return client.check(`Successfully disabled the ${command.name} command!`, message);
                } catch (err) {
                    log.error(err, __filename, message.author.id);
                    return client.error('Failed unloading command, error logged on console.', message);
                }
            } else {
                cat = {
                    admin: 'admin',
                    gen: 'general',
                    main: 'maintenance',
                    mod: 'moderation',
                    set: 'settings'
                }[cat];
                if (!cat) return client.error('Unknown category specified.', message);
                try {
                    const command = require(`../${cat}/${cmd}.js`);
                    command.cat = cat;
                    client.commands.set(command.name, command);
                    if (command.aliases) command.aliases.forEach(a => client.commands.set(a, command.name));
                    return client.check(`Successfully loaded the ${command.name} command!`, message);
                } catch (err) {
                    log.error(err, __filename, message.author.id);
                    return client.error('Failed loading command, error logged on console.', message);
                }
            }
        }
    }
}
