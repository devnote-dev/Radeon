/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const
    BOLD = '==================================',
    SMALL = '----------------------',

    RED = '\x1b[31m',
    YELLOW = '\x1b[33m',
    GREEN = '\x1b[32m',
    CYAN = '\x1b[36m',
    PURPLE = '\x1b[35m',
    RESET = '\x1b[0m';
const log = console.log;

async function ready(bot) {
    const db = await bot.db('settings').get(bot.user.id);
    let fmt = `${BOLD}\n${PURPLE}Radeon is ready!${RESET}\n\n`;
    fmt += `${PURPLE + bot.stats._events.toString() + RESET} Events loaded\n`;
    fmt += `${GREEN + bot.stats.commands.size.toString() + RESET} Commands loaded\n`;
    fmt += `${RED + bot.stats._failed.toString() + RESET} Commands failed`;
    if (bot.stats._failed.length) fmt += ':\n' + bot.stats._failed.map(c => `- ${RED + c + RESET}`).join('\n');
    fmt += `\nReady at: ${bot.readyAt.toLocaleString()}\nServers: ${bot.guilds.cache.size}\n`;
    fmt += `Maintenance: ${db.maintenance}\nCycle: ${db.cycleStatus}`;
    return log(fmt);
}

function shard(bot, type, id) {
    let fmt = `${PURPLE}SHARD${RESET} | ${id} of ${bot.shard.count} `;
    switch (type) {
        case 'create': fmt += 'Created'; break;
        case 'discon': fmt += `Disconnected: ${new Date().toLocaleTimeString()}`; break;
        case 'error': log += `Errored: ${new Date().toLocaleTimeString()}`; break;
        case 'ready': fmt += 'Ready'; break;
        case 'recon': fmt += 'Reconnecting'; break;
        case 'resume': fmt += 'Resumed'; break;
        default: fmt += `Unknown: Invalid Log Request\nPath: ${__dirname}`; break;
    }
    return log(fmt);
}
shard.spawn = (shard) => {
    return log(`${PURPLE}SHARD${RESET} | ${shard.id} of ${shard.manager.totalShards} Spawned`);
}

function db(state, data) {
    let fmt;
    switch (state) {
        case 'connected':
            log = `${GREEN}MONGO${RESET} | Connected`;
            break;
        case 'error':
            log = `${YELLOW}MONGO${RESET} | Error: ${data || 'Data Unavailable'}`;
            break;
        case 'disconnected':
            log = `${RED}MONGO${RESET} | Disconnected`;
            break;
    }
    return log(fmt);
}

function admin(type, path, user, args) {
    let fmt;
    if (typeof path === 'object') {
        path = path.channel.id +'/'+ path.id;
    } else if (path.includes('/')) {
        path = path.split('/').pop();
    }
    switch (type) {
        case 'eval':
            fmt = `${YELLOW}Eval${RESET}\nPath ${path}\nUser: ${user}\nCmd: ${args}\n`; break;
        case 'exec':
            fmt = `${YELLOW}Execute${RESET}\nPath: ${path}\nUser: ${user}\nCmd: ${args}`; break;
        case 'reload':
            fmt = `${YELLOW}Reload${RESET}\nPath: ${path}\nUser: ${user}\nFile: ${args}`; break;
        case 'status':
            fmt = `${YELLOW}Status${RESET}\nPath: ${path}\nUser: ${user}\nMessage: ${args}`; break;
    }
    return log(SMALL +'\n'+ fmt);
}

function error(err, path, user) {
    if (typeof path === 'object') {
        path = path.channel.id +'/'+ path.id;
    } else if (path.includes('/')) {
        path = path.split('/').pop();
    }
    let fmt = `${RED}ERROR${RESET} | ${err.name}\nPath: ${path}\nUser: ${user || 'internal'}\nMessage: ${err.message}\n`;
    return log(SMALL +'\n'+ fmt);
}

module.exports = {
    ready,
    shard,
    db,
    admin,
    error
}
