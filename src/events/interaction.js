/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { logError } = require('../console/consoleR');

exports.run = async (client, interaction) => {
    if (!interaction.isCommand()) return;
    try {
        if (client.slash.has(interaction.commandName)) {
            await client.slash.get(interaction.commandName)(client, interaction);
        }
    } catch (err) {
        logError(err, __filename, interaction.user?.id);
    }
}
