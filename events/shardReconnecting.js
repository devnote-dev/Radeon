/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */

const { logs } = require('../config.json');

module.exports = (client, shard) => {
    if (chan = client.channels.cache.get(logs.event)) {
        chan.send({
            embeds:[{
                description: `${client.const.evt.recon} Reconnecting to Shard ${shard}`,
                color: client.const.col.yellow
            }]
        }).catch(()=>{});
    }
}
