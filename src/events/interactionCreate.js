/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

module.exports = async (client, int) => {
    if (!int.isCommand()) return;
    try {
        if (client.slash.has(int.commandName)) {
            return await client.slash.get(int.commandName)(client, int);
        }
    } catch (err) {
        client.logger.error(err);
    }
}
