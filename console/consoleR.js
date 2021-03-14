"use strict";
exports.__esModule = true;
exports.logError = exports.logWarn = exports.logAdmin = exports.logDB = exports.logShardSpawn = exports.botReady = void 0;
function borderBold() {
    return console.log('==================================');
}
function borderSmall() {
    return console.log('-----------------');
}
function botReady(client) {
    var loaded = client.commands.size;
    var failed = client.commands.get('_failed');
    var events = client.commands.get('_events');
    var guilds = client.guilds.cache.size;
    var log = "\u001B[35mRadeon is Ready!\u001B[0m\n\n\u001B[32m" + loaded + "\u001B[0m Loaded Commands\n\u001B[31m" + failed.length + "\u001B[0m Failed Commands\n\u001B[36m" + events + "\u001B[0m Loaded Events";
    if (failed.length)
        log += ':\n\x1b[31m' + failed.join('\n') + '\x1b[0m';
    log += "\n\nConnected to " + guilds + " servers";
    if (client.readyAt)
        log += '\nReady at: ' + client.readyAt.toLocaleString();
    borderBold();
    console.log(log);
    return borderBold();
}
exports.botReady = botReady;
function logShardSpawn(shard) {
    return console.log("\n\u001B[35mSHARD\u001B[0m | " + shard.id + " of " + shard.manager.totalShards + " Spawned");
}
exports.logShardSpawn = logShardSpawn;
function logDB(type, data) {
    var log;
    switch (type) {
        case 'connected':
            log = "\u001B[32mMONGO\u001B[0m | Connected";
            break;
        case 'error':
            log = "\u001B[33mMONGO\u001B[0m | Error\n" + (data ? data : 'Data Unavailable');
            break;
        case 'disconnected':
            log = "\u001B[31mMONGO\u001B[0m | Disconnected\nServers may be temporarily unavailable.";
            break;
    }
    return console.log(log);
}
exports.logDB = logDB;
function logAdmin(type, path, user, args) {
    var log;
    switch (type) {
        case 'eval':
            log = "\u001B[33mEval\u001B[0m\nPath: " + path + "\nUser: " + user + "\n\n" + args;
            break;
        case 'exec':
            log = "\u001B[33mExecute\u001B[0m\nPath: " + path + "\nUser: " + user + "\nCmd: " + args;
            break;
        case 'reload':
            log = "\u001B[33mReload\u001B[0m\nPath: " + path + "\nUser: " + user + "\nFile: " + args + ".js";
            break;
        case 'status':
            log = "\u001B[33mSetstatus\u001B[0m\nPath: " + path + "\nUser: " + user + "\n" + args;
            break;
    }
    borderSmall();
    return console.log(log);
}
exports.logAdmin = logAdmin;
function logWarn(msg, error) {
    var log = "\u001B[33mWARNING!\u001B[0m " + msg;
    if (error)
        log += "\n" + error.message;
    borderSmall();
    return console.log(log);
}
exports.logWarn = logWarn;
function logError(err) {
    var log = "\u001B[31mERROR!\u001B[0m " + err.name + "\n" + err.message;
    if (err.stack)
        log += "\n\n" + err.stack;
    borderSmall();
    return console.log(log);
}
exports.logError = logError;
