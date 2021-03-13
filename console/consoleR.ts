import { Shard } from "discord.js";

function borderBold() {
    return console.log('==================================');
}
function borderSmall() {
    return console.log('-----------------');
}

function botReady(client: any) {
    const loaded = client.commands.size;
    const failed = client.commands.get('_failed');
    const events = client.commands.get('_events');
    const guilds = client.guilds.cache.size;
    let log = `\x1b[35mRadeon is Ready!\x1b[0m\n\n\x1b[32m${loaded}\x1b[0m Loaded Commands\n\x1b[31m${failed.length}\x1b[0m Failed Commands\n\x1b[36m${events}\x1b[0m Loaded Events`;
    if (failed.length) log += ':\n\x1b[31m'+ failed.join('\n') +'\x1b[0m';
    log += `\n\nConnected to ${guilds} servers`;
    if (client.readyAt) log += '\nReady at: '+ client.readyAt.toLocaleString();
    borderBold();
    console.log(log);
    return borderBold();
}

function logShardSpawn(shard: Shard) {
    return console.log(`\n\x1b[35mSHARD\x1b[0m | ${shard.id} of ${shard.manager.totalShards} Spawned`);
}

function logDB(type: string, data?: any) {
    let log: string;
    switch (type) {
        case 'connected':
            log = `\x1b[32mMONGO\x1b[0m | Connected`;
            break;
        case 'error':
            log = `\x1b[33mMONGO\x1b[0m | Error\n${data ? data : 'Data Unavailable'}`;
            break;
        case 'disconnect':
            log = `\x1b[31mMONGO\x1b[0m | Disconnected\nServers may be temporarily unavailable.`;
            break;
    }
    return console.log(log);
}

function logWarn(msg: string, error?: Error) {
    let log = `\x1b[33mWARNING!\x1b[0m ${msg}`;
    if (error) log += `\n${error.message}`;
    borderSmall();
    return console.log(log);
}
function logError(err: Error) {
    let log = `\x1b[31mERROR!\x1b[0m ${err.name}\n${err.message}`;
    if (err.stack) log += `\n\n${err.stack}`;
    borderSmall();
    return console.log(log);
}

export { botReady, logShardSpawn, logDB, logWarn, logError }