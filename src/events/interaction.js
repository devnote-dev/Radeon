const { logError } = require('../console/consoleR');

exports.run = async (client, interaction) => {
    if (!interaction.isCommand()) return;
    try {
        if (client.slash.has(interaction.commandName)) {
            const slash = client.slash.get(interaction.commandName);
            await slash(client, interaction);
        }
    } catch (err) {
        logError(err, __filename, interaction.user?.id);
    }
}
