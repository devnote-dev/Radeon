const { readdirSync } = require('fs');

module.exports = async client => {
    let failed = [];
    readdirSync('./src/commands/').forEach(dir => {
        readdirSync(`./src/commands/${dir}/`)
        .filter(f => f.endsWith('.js'))
        .forEach(cmd => {
            const command = require(`../commands/${dir}/${cmd}`);
            if (command.name) {
                client.commands.set(command.name, command);
                if (command.appdata) client.slash.set(command.appdata.name, command.appres);
            } else if (command.appdata) {
                client.slash.set(command.appdata.name, command.appres);
            } else {
                failed.push(cmd);
            }
            if (command.aliases && Array.isArray(command.aliases)) command.aliases.forEach(a => client.aliases.set(a, command.name));
        });
    });
    client.stats._failed = failed;
}
