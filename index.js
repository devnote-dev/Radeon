const {token} = require('./config.json');
const {ShardingManager} = require('discord.js');
const manager = new ShardingManager(`./Radeon.js`, {
    totalShards: 'auto',
    respawn: true,
    token: token
});

manager.spawn();

manager.on('shardCreate', async shard => {
    console.log(`Shard ${shard.id} / 1 - Spawned`);
});
