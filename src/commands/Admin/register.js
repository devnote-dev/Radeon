/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { readdirSync } = require('fs');
const log = require('../../log');

module.exports = {
    name: 'register',
    description: 'Registers Radeon\'s global slash commands into Discord.',
    modOnly: 2,

    async run(client, message) {
        try {
            const payload = [];
            let count = 0;
            readdirSync('./src/commands/')
            .forEach(dir => {
                readdirSync(`./src/commands/${dir}/`)
                .filter(f => f.endsWith('.js'))
                .forEach(async cmd => {
                    const command = require(`../${dir}/${cmd}`);
                    if (command.slash || command.description) {
                        const data = {};
                        data.name = command.name;
                        data.description = command.description;
                        if (command.options) data.options = command.options;
                        payload.push(data);
                        count++;
                        if (!client.slash.has(command.name)) client.slash.set(command.name, command.slash);
                    }
                });
            });
            await client.application.commands.set(payload);
            return client.check(`Successfully Registered ${count} Slash Commands!`, message);
        } catch (err) {
            log.error(err, message, message.author.id);
            return client.error('Failed registering (logged on console).', message);
        }
    }
}
