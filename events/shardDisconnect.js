/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */

const { logs } = require('../config.json');

module.exports = (client, _, shard) => {
    if (chan = client.channels.cache.get(logs.event)) {
        chan.send({
            embeds:[{
                description: `${client.const.evt.discon} Shard ${shard} disconnected`,
                color: client.const.col.red
            }]
        }).catch(()=>{});
    }
}
