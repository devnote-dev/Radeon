/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { logError } = require('../dist/console');

exports.run = async (client, int) => {
    if (!int.isCommand()) return;
    try {
        if (client.slash.has(int.commandName)) {
            await client.slash.get(int.commandName)(client, int);
        }
    } catch (err) {
        logError(err, __filename, int?.user.id);
    }
}
