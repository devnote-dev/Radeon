/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */

const { token } = require('./config.json');
const { ShardingManager } = require('discord.js');

const manager = new ShardingManager('./radeon.js', {
    totalShards: 'auto',
    respawn: true,
    token
});

manager.spawn();
