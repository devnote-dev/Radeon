const {readdirSync} = require('fs');

module.exports = async client => {
    readdirSync('./commands/').forEach(dir => {
        readdirSync(`./commands/${dir}/`).filter(f => f.endsWith('.js')).forEach(cmd => {
            const command = require(`../commands/${dir}/${cmd}`);
            if (!command.name) console.log('Failed Command: '+ cmd);
            client.commands.set(command.name, command);
            console.log('Loaded Command: '+ cmd);
            if (command.aliases && Array.isArray(command.aliases)) client.aliases.forEach(a => client.aliases.set(a, command.name));
        });
    });
}
