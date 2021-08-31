/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

module.exports = {
    name: 'toggle',
    description: 'Toggles Radeon\'s maintenance mode (disables all commands, functions).',
    usage: 'toggle <option>',
    modOnly: 1,
    async run(client, message, args) {
        if (!args.length) return client.errEmb('Insufficient Arguments.\n```\ntoggle <option>\n```', message);
        if (!['main', 'cycle'].includes(args.lower[0])) return client.errEmb('Unknown settings option.', message);
        const db = client.db('settings');
        const state = db.get(client.user.id);
        if (args.lower[0] === 'main') {
            await db.update(client.user.id, {
                cycleStatus: state.cycleStatus,
                maintenance: !state.maintenance
            });
            return client.errEmb(`Maintenance mode successfully ${state.maintenance ? 'disabled' : 'enabled'}!`, message);
        }
        await db.update(client.user.id, {
            cycleStatus: !state.cycleStatus,
            maintenance: state.maintenance
        });
        return client.errEmb(`Cycle status successfully ${state.cycleStatus ? 'disabled' : 'enabled'}!`, message);
    }
}
