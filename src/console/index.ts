/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

import { Shard } from 'discord.js';
import Settings from '../database/settings';

function borderBold() {
    return console.log('==================================');
}
function borderSmall() {
    return console.log('----------------------');
}

async function botReady(client: any) {
    const events = client.stats._events;
    const loaded = client.commands.size;
    const failed = client.stats._failed;
    const guilds = client.guilds.cache.size;
    const state: any = await Settings.findOne({ client: client.user.id });
    let log = `\x1b[35mRadeon is Ready!\x1b[0m\n\n\x1b[36m${events}\x1b[0m Loaded Events\n\x1b[32m${loaded}\x1b[0m Loaded Commands\n\x1b[31m${failed ? failed.length : 0}\x1b[0m Failed Commands`;
    if (failed && failed.length) log += ':\n\x1b[31m- '+ failed.join('\n- ') +'\x1b[0m';
    log += `\n\nConnected to ${guilds} server(s)`;
    if (client.readyAt) log += '\nReady at: '+ client.readyAt.toLocaleString();
    log += `\nMaintenance: ${state.maintenance}\nCycle Status: ${state.cycleStatus}\n`;
    borderBold();
    return console.log(log);
}

function logShardSpawn(shard: Shard) {
    return console.log(`\n\x1b[35mSHARD\x1b[0m | ${shard.id} of ${shard.manager.totalShards} Spawned`);
}

function logShard(client: any, type: string, shard: number) {
    let log: string = `\x1b[35mSHARD\x1b[0m | ${shard} of ${client.shard.count} `;
    switch (type) {
        case 'create': log += 'Created'; break;
        case 'discon': log += `Disconnected: ${new Date().toLocaleTimeString()}`; break;
        case 'error': log += `Errored: ${new Date().toLocaleTimeString()}`; break;
        case 'ready': log += 'Ready'; break;
        case 'recon': log += 'Reconnecting'; break;
        case 'resume': log += 'Resumed'; break;
        default: log += `Unknown: Invalid Log Request\nPath: ${__dirname}`; break;
    }
    return console.log(log);
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
        case 'disconnected':
            log = `\x1b[31mMONGO\x1b[0m | Disconnected`;
            break;
    }
    return console.log(log);
}

function logAdmin(type: string, path: string, user: string, args: string) {
    let log: string;
    switch (type) {
        case 'eval':
            log = `\x1b[33mEval\x1b[0m\nPath: ${path}\nUser: ${user}\n\n${args}\n`;
            break;
        case 'exec':
            log = `\x1b[33mExecute\x1b[0m\nPath: ${path}\nUser: ${user}\nCmd: ${args}\n`;
            break;
        case 'reload':
            log = `\x1b[33mReload\x1b[0m\nPath: ${path}\nUser: ${user}\nFile: ${args}.js\n`;
            break;
        case 'status':
            log = `\x1b[33mSetstatus\x1b[0m\nPath: ${path}\nUser: ${user}\n${args}\n`;
            break;
    }
    borderSmall();
    return console.log(log);
}

function logWarn(msg: string, error?: Error) {
    let log = `\x1b[33mWARNING!\x1b[0m ${msg}`;
    if (error) log += `\n${error.message}`;
    borderBold();
    return console.log(log);
}
function logError(err: Error, path: string, user?: string) {
    let log = `\x1b[31mERROR!\x1b[0m ${err.name}\n\nPath: ${path}`;
    if (user) log += `\nUser: ${user}`;
    if (err.stack) log += `\n\n${err.stack}`;
    borderBold();
    return console.log(log);
}

export {
    botReady,
    logShardSpawn,
    logShard,
    logDB,
    logAdmin,
    logWarn,
    logError
}
