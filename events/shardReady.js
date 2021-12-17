/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */

const { logs } = require('../config.json');

module.exports = (client, shard, _) => {
    if (chan = client.channels.cache.get(logs.event)) {
        chan.send({
            embeds:[{
                description: `${client.const.evt.ready} Connected to Shard ${shard} of ${client.shard.count}`,
                color: client.const.col.green
            }]
        }).catch(()=>{});
    }
}
