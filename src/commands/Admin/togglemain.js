/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { logWarn } = require('../../dist/console');

module.exports = {
    name: 'togglemain',
    description: 'Toggles Radeon\'s maintenance mode (disables all commands, functions).',
    modOnly: 1,
    async run(client, message) {
        const db = client.db('settings');
        const state = await db.get(client.user.id);
        await db.update(client.user.id, { maintenance: !state.maintenance });
        logWarn(`Maintenance Mode Updated to ${!state.maintenance}`);
        return client.checkEmb(`Maintenance Mode Successfully ${state.maintenance ? 'Disabled' : 'Enabled'}!`, message);
    }
}
