/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { token } = require('../config.json');
const { ShardingManager } = require('discord.js');
const log = require('./log');

const manager = new ShardingManager('./src/Radeon.js', {
    totalShards: 'auto',
    respawn: true,
    token
});

manager.on('shardCreate', shard => log.shard.spawn(shard));
manager.spawn();
