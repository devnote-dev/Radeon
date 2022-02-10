const { readdirSync } = require('fs');
const { join } = require('path');

module.exports = async client => {
    readdirSync(join(process.cwd(), 'src', 'events'))
    .forEach(file => {
        const event = require(`./events/${file}`);
        client.on(file.split('.')[0], async (...args) => await event(client, ...args));
        client.logger.loadedEvents++;
    });

    readdirSync(join(process.cwd(), 'src', 'commands'))
    .forEach(file => {
        try {
            const cmd = require(`./commands/${file}`);
            client.commands.set(cmd.name, cmd);
        } catch (err) {
            client.logger.saveError(err);
        }
    });

    Promise.resolve();
}
