const {readdirSync} = require('fs');

module.exports = async client => {
    let loaded = 0;
    readdirSync('./events/').filter(f => f.endsWith('.js')).forEach(e => {
        const event = require(`../events/${e}`);
        loaded++;
        client.on(e.split('.').shift(), (...args) => event.run(client, ...args));
    });
    if (!loaded) {
        console.log(`\x1b[35mRadeon\x1b[0m | \x1b[31m${failed}\x1b[0m Events Loaded.\nInsufficient Events To Run Radeon. Terminating...`);
        process.exit();
    } else {
        console.log(`\x1b[35mRadeon\x1b[0m | \x1b[32m${loaded}\x1b[0m Events Loaded`);
    }
}
