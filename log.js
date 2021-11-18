/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */

const
    BOLD = '==================================',
    RED = '\x1b[31m',
    YELLOW = '\x1b[33m',
    GREEN = '\x1b[32m',
    CYAN = '\x1b[36m',
    PURPLE = '\x1b[35m',
    RESET = '\x1b[0m';

const log = console.log;

function ready(bot) {
    let fmt = `${BOLD}\n${PURPLE}Radeon is ready!${RESET}\n\n`;
    // fmt += `${PURPLE + bot.stats._events.toString() + RESET} Events loaded\n`;
    // fmt += `${GREEN + bot.stats._commands.toString() + RESET} Commands loaded\n`;
    // fmt += `${RED + bot.stats._failed.length.toString() + RESET} Commands failed`;
    fmt += `\n\nReady at: ${bot.readyAt.toLocaleString()}\nServers: ${bot.guilds.cache.size}\n`;
    return log(fmt);
}

function info(...message) {
    log(`${CYAN}INFO${RESET} |`, ...message);
}

function warn(msg, path=null) {
    let fmt = `${YELLOW}WARN${RESET} | ${msg}`;
    if (path) {
        if (typeof path === 'object') {
            path = path.channel.id +'/'+ path.id;
        } else if (path.includes('/')) {
            path = path.split('/').pop();
        }
        fmt += `\nPath: ${path}`;
    }
    log(fmt);
}

function error(err, path, user) {
    if (typeof path === 'object') {
        path = path.channel.id +'/'+ path.id;
    } else if (path.includes('/')) {
        path = path.split('/').pop();
    }
    let fmt = `${RED}ERROR${RESET} | ${err.name}\nPath: ${path}\nUser: ${user || 'internal'}\nMessage: ${err.stack}\n`;
    return log(SMALL +'\n'+ fmt);
}

module.exports = {
    ready,
    info,
    warn,
    error
}
