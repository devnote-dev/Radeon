/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { readdirSync } = require('fs');
const { logError } = require('../../dist/console');

module.exports = {
    name: 'register',
    description: 'Registers Radeon\'s global slash commands into Discord.',
    modOnly: 2,
    async run(client, message) {
        try {
            let count = 0;
            readdirSync('./src/commands/')
            .forEach(dir => {
                readdirSync(`./src/commands/${dir}/`)
                .filter(f => f.endsWith('.js'))
                .forEach(async cmd => {
                    const command = require(`../${dir}/${cmd}`);
                    if (!command.appdata) return;
                    await client.application.commands.create(command.appdata);
                    count++;
                    if (!client.slash.has(command.appdata.name)) client.slash.set(command.appdata.name, command.appres);
                });
            });
            return client.checkEmb(`Successfully Registered ${count} Slash Commands!`, message);
        } catch (err) {
            logError(err, __filename, message.author.id);
            return client.errEmb('Failed Registering (logged on console).', message);
        }
    }
}
