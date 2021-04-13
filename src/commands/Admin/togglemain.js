require('discord.js');
const Settings = require('../../schemas/settings-schema');

module.exports = {
    name: 'togglemain',
    description: 'Toggles Radeon\'s maintenance mode (disables all commands, functions).',
    modOnly: 1,
    run: async (client, message) => {
        const state = await Settings.findOne({ client: client.user.id });
        await Settings.findOneAndUpdate(
            { client: client.user.id },
            { $set:{ maintenance: !state }},
            { new: true }
        );
        return client.checkEmb(`Maintenance Mode Successfully ${!state ? 'Enabled' : 'Disabled'}!`, message);
    }
}