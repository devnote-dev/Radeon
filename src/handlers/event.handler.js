const filehound = require('filehound');
const { parse, join } = require('path');

module.exports = async client => {
    let loaded = 0;

    filehound.create()
    .path(join(process.cwd(),'src','events'))
    .ext('.js')
    .findSync()
    .forEach(e => {
        const event = require(e);
        loaded++;
        client.on(parse(e).base.split('.')[0], (...args) => {
            client.stats.events++;
            event.run(client, ...args);
        });
    });
    if (!loaded) {
        console.log(`\x1b[35mRadeon\x1b[0m | \x1b[31m0\x1b[0m Events Loaded.\nInsufficient Events To Run Radeon. Terminating...`);
        process.exit();
    } else {
        client.stats._events = loaded;
    }
}
