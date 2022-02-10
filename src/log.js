/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

class Logger {
    constructor() {
        this.loadedEvents = 0;
        this.botEventsRan = 0;
        this.guildEventsRan = 0;
        this.schedulesRan = 0;
        this.errors = new Map();
    }

    botReady() {
        const fmt = [
            '\x1b[35mRadeon is ready!\x1b[0m',
            `\x1b[32m${this.loadedEvents}\x1b[0m events loaded`,
            `\x1b[31m${this.errors.size}\x1b[0m errors received`
        ];

        if (this.errors.size) this.errors.forEach(
            (_, v) => fmt.push(`\t - ${v.message}`)
        );

        console.log(
            fmt.map(m => `\x1b[32mREADY\x1b[0m | ${m}`).join('\n')
        );
    }

    saveError(data) {
        if (typeof data === 'string') {
            this.errors.set(Date.now(), {
                message: data,
                stack: null
            });
        } else {
            this.errors.set(Date.now(), {
                message: data.message,
                stack: data.stack
            });
        }
    }

    info(message) {
        console.log(`\x1b[36mINFO\x1b[0m  | ${message}`);
    }

    shard(num, message) {
        console.log(`\x1b[35mSHARD\x1b[0m | ${num}: ${message}`);
    }

    warn(message) {
        console.log(`\x1b[33mWARN\x1b[0m  | ${message}`);
    }

    error(data) {
        if (typeof data === 'string') {
            console.log(`\x1b[31mERROR\x1b[0m | ${data}`);
        } else {
            data.message
                .split('\n')
                .forEach(line =>
                    console.log(`\x1b[31mERROR\x1b[0m | ${line}`)
                );
        }
        this.saveError(data);
    }
}

module.exports = Logger;
