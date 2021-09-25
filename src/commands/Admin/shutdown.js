/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

module.exports = {
    name: 'shutdown',
    aliases: ['restart'],
    description: 'Shuts down existing instances of Radeon. Note: this may result in the Client restarting if sharded or using an auto-restart system.',
    guildOnly: true,
    modOnly: 1,

    async run(client, message) {
        await message.react('a:loading:786661451385274368').catch(()=>{});
        client.destroy();
        return process.exit(0);
    }
}
