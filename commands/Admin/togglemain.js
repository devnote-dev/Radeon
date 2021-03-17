require('discord.js');
const Settings = require('../../schemas/settings-schema');

module.exports = {
    name: 'togglemain',
    description: 'Toggles Radeon\'s maintenance mode (disables all commands, functions).',
    modOnly: 'warn',
    run: async (client, message) => {
        const state = await Settings.findOne({ client: client.user.id });
        switch (state.maintenance) {
            case true: newstate = false; break;
            case false: newstate = true; break;
            default: newstate = false; break;
        }
        await Settings.findOneAndUpdate(
            { client: client.user.id },
            { $set:{ maintenance: newstate }},
            { new: true }
        );
        return client.checkEmb(`Maintenance Mode Successfully ${newstate ? 'Disabled' : 'Enabled'}!`, message);
    }
}