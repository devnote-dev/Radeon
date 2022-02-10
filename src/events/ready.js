/**
 * @author Piter <https://github.com/piterxyz>
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

module.exports = client => {
    client.user.setPresence({
        status: 'online',
        activities:[{
            name: 'Slash Commands',
            type: 'LISTENING'
        }]
    });
    client.logger.botReady();
}
