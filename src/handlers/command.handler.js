const filehound = require('filehound');
const { parse, join } = require('path');

module.exports = async client => {
    const failed = [];

    filehound.create()
    .path(join(process.cwd(),'src','commands'))
    .ext('.js')
    .findSync()
    .forEach(cmd => {
        const command = require(cmd);
        if (command.name) {
            client.commands.set(command.name, command);
            if (command.appdata) client.slash.set(command.appdata.name, command.appres);
        } else if (command.appdata) {
            client.slash.set(command.appdata.name, command.appres);
        } else {
            failed.push(parse(cmd).base);
        }
        if (command.aliases && Array.isArray(command.aliases)) command.aliases.forEach(a => client.aliases.set(a, command.name));
    });
    client.stats._failed = failed;
}
