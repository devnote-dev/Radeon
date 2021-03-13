const { token } = require('./config.json');
const { ShardingManager } = require('discord.js');
const { logShardSpawn } = require('./console/consoleR');
const manager = new ShardingManager(`./Radeon.js`, {
    totalShards: 'auto',
    respawn: true,
    token: token
});

manager.on('shardCreate', async shard => {
    logShardSpawn(shard);
});

manager.spawn();
