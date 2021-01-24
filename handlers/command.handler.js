const {readdirSync} = require('fs');

module.exports = async client => {
    let failed = 0;
    readdirSync('./commands/').forEach(dir => {
        readdirSync(`./commands/${dir}/`).filter(f => f.endsWith('.js')).forEach(cmd => {
            const command = require(`../commands/${dir}/${cmd}`);
            if (command.name) {
                client.commands.set(command.name, command);
            } else {
                failed++;
            }
            if (command.aliases && Array.isArray(command.aliases)) command.aliases.forEach(a => client.aliases.set(a, command.name));
        });
    });
    console.log(`\n\x1b[35mRadeon\x1b[0m | \x1b[32m${client.commands.size}\x1b[0m Loaded Commands`);
    console.log(`\x1b[35mRadeon\x1b[0m | \x1b[31m${failed}\x1b[0m Failed Commands`);
}
