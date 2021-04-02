"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.logError = exports.logWarn = exports.logAdmin = exports.logDB = exports.logShard = exports.logShardSpawn = exports.botReady = void 0;
var settings_schema_1 = require("../schemas/settings-schema");
function borderBold() {
    return console.log('==================================');
}
function borderSmall() {
    return console.log('----------------------');
}
function botReady(client) {
    return __awaiter(this, void 0, void 0, function () {
        var loaded, failed, events, guilds, state, log;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loaded = client.commands.size;
                    failed = client.stats._failed;
                    events = client.stats._events;
                    guilds = client.guilds.cache.size;
                    return [4 /*yield*/, settings_schema_1.findOne({ client: client.user.id })];
                case 1:
                    state = _a.sent();
                    log = "\u001B[35mRadeon is Ready!\u001B[0m\n\n\u001B[32m" + loaded + "\u001B[0m Loaded Commands\n\u001B[31m" + (failed ? failed.length : 0) + "\u001B[0m Failed Commands\n\u001B[36m" + events + "\u001B[0m Loaded Events";
                    if (failed && failed.length)
                        log += ':\n\x1b[31m' + failed.join('\n') + '\x1b[0m';
                    log += "\n\nConnected to " + guilds + " servers";
                    if (client.readyAt)
                        log += '\nReady at: ' + client.readyAt.toLocaleString();
                    log += "\nMaintenance: " + state.maintenance;
                    borderBold();
                    return [2 /*return*/, console.log(log)];
            }
        });
    });
}
exports.botReady = botReady;
function logShardSpawn(shard) {
    return console.log("\n\u001B[35mSHARD\u001B[0m | " + shard.id + " of " + shard.manager.totalShards + " Spawned");
}
exports.logShardSpawn = logShardSpawn;
function logShard(client, type, shard) {
    var log = "\u001B[35mSHARD\u001B[0m | " + shard + " of " + client.shard.count + " ";
    switch (type) {
        case 'create':
            log += 'Created';
            break;
        case 'discon':
            log += "Disconnected: " + new Date().toLocaleTimeString();
            break;
        case 'error':
            log += "Errored: " + new Date().toLocaleTimeString();
            break;
        case 'ready':
            log += 'Ready';
            break;
        case 'recon':
            log += 'Reconnecting';
            break;
        default: log += "Unknown: Invalid Log Request\nPath: " + __dirname;
    }
    borderSmall();
    return console.log(log);
}
exports.logShard = logShard;
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
    borderSmall();
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
    borderBold();
    return console.log(log);
}
exports.logWarn = logWarn;
function logError(err, path, user) {
    var log = "\u001B[31mERROR!\u001B[0m " + err.name + "\n\nPath: " + path;
    if (user)
        log += "\nUser: " + user;
    if (err.stack)
        log += "\n\n" + err.stack;
    borderBold();
    return console.log(log);
}
exports.logError = logError;
