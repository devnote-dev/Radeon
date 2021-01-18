const {readdirSync} = require('fs');

module.exports = async client => {
    readdirSync('./events/').filter(f => f.endsWith('.js')).forEach(e => {
        const event = require(`../events/${e}`);
        console.log('Loaded Event: '+ e);
        client.on(e.split('.').shift(), (...args) => event.run(client, ...args));
    });
}
