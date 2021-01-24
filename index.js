const {token} = require('./config.json');
const {ShardingManager} = require('discord.js');
const manager = new ShardingManager(`./Radeon.js`, {
    totalShards: 'auto',
    respawn: true,
    token: token
});

manager.on('shardCreate', async shard => {
    console.log(`Shard ${shard.id} / ${shard.totalShards} - Spawned`);
});

manager.spawn();
