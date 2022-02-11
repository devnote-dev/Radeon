/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021-2022
 */

const { token } = require('../config.json');
const { ShardingManager } = require('discord.js');

new ShardingManager('./src/Radeon.js', {
    totalShards: 'auto',
    respawn: true,
    token
}).spawn();
