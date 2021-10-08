/**
 * @author Devonte <https://github.com/devnote-dev>
 * @author Specky <https://github.com/SpeckyYT>
 * @copyright Radeon Development 2021
 */

const filehound = require('filehound');
const { parse, join } = require('path');

module.exports = async client => {
    let ready = 0;
    const failed = [];

    filehound.create()
        .path(join(process.cwd(),'src','commands'))
        .ext('.js')
        .findSync()
        .forEach(cmd => {
            try {
                const command = require(cmd);
                if (command.name) {
                    client.commands.set(command.name, command);
                    if (command.slash) client.slash.set(command.name, command.slash);
                    ready++;
                } else if (command.slash) {
                    client.slash.set(command.name, command.slash);
                    ready++;
                } else {
                    failed.push(parse(cmd).base);
                }
                if (command.aliases && Array.isArray(command.aliases)) command.aliases.forEach(a => client.aliases.set(a, command.name));
            } catch {
                failed.push(parse(cmd).base);
            }
        });
    client.stats._commands = ready;
    client.stats._failed = failed;
}
