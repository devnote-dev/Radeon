const { readdirSync } = require('fs');
const { logError } = require('../../console/consoleR');

module.exports = {
    name: 'register',
    description: 'Registers Radeon\'s global slash commands into Discord.',
    modOnly: 2,
    async run(client, message) {
        // temporary fix until client.application.owner returns an actual object
        if (message.author.id !== '622146791659405313') return client.errEmb('Restricted to Application Owner Only.', message);
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
                    if (!client.slash.has(command.appdata.name)) client.slash.set(command.appdata.name, command.appres);
                    count++;
                });
            });
            return client.checkEmb(`Successfully Registered ${count} Slash Commands!`, message);
        } catch (err) {
            logError(err, __dirname+__filename, message.author.id);
            return client.errEmb('Failed Registering (logged on console).', message);
        }
    }
}
