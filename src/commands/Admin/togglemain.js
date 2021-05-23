/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const Settings = require('../../schemas/settings-schema');

module.exports = {
    name: 'togglemain',
    description: 'Toggles Radeon\'s maintenance mode (disables all commands, functions).',
    modOnly: 1,
    async run(client, message) {
        const state = await Settings.findOne({ client: client.user.id });
        await Settings.findOneAndUpdate(
            { client: client.user.id },
            { $set:{ maintenance: !state }},
            { new: true }
        );
        return client.checkEmb(`Maintenance Mode Successfully ${!state ? 'Enabled' : 'Disabled'}!`, message);
    }
}