/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @author Piter <https://github.com/piterxyz>
 * @copyright 2021 Radeon Development
 */

const { readdirSync } = require('fs');

module.exports = (client) => {
    readdirSync('./commands/')
    .forEach(dir => {
        readdirSync(`./commands/${dir}/`)
        .forEach(file => {
            const cmd = require(`./commands/${dir}/${file}`);
            client.commands.set(cmd.name, cmd);
        });
    });

    readdirSync('./events/')
    .forEach(file => {
        const event = require(`./events/${file}`);
        client.on(file.split('.')[0], (...ctx) => event(client, ...ctx));
    });
}
