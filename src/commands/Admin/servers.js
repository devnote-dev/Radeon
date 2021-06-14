/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const ascii = require('ascii-table');

module.exports = {
    name: 'servers',
    aliases: ['allservers'],
    description: 'Shows all the servers Radeon is in.',
    guildOnly: true,
    modOnly: 3,
    async run(client, message) {
        const table = new ascii();
        table.setHeading('Server Name', 'Server ID', 'Available');
        client.guilds.cache.forEach(g => table.addRow(g.name, g.id, g.available));
        return message.channel.send('```\n'+ table.toString() +'\n```');
    }
}
