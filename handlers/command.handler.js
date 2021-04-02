const { readdirSync } = require('fs');

module.exports = async client => {
    let failed = [];
    readdirSync('./commands/').forEach(dir => {
        readdirSync(`./commands/${dir}/`)
        .filter(f => f.endsWith('.js'))
        .forEach(cmd => {
            const command = require(`../commands/${dir}/${cmd}`);
            if (command.name) {
                client.commands.set(command.name, command);
            } else {
                failed.push(cmd);
            }
            if (command.aliases && Array.isArray(command.aliases)) command.aliases.forEach(a => client.aliases.set(a, command.name));
        });
    });
    client.stats._failed.append(Array.of<String>(failed));
}
