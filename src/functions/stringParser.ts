/**
 * Strings Parser
 * 
 * There will be NO support for the use of this file
 * except for self-hosted instances of Radeon
 * (which is currently not supported).
 * 
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


type FlagOptions = {
    name: string;
    type:
    |'string'
    |'int'
    |'bool'
    |'user'
    |'channel';
    quotes?: boolean;
}

type Flag = {
    name:  string;
    value: any;
}

/**
 * Parses arguments encased in quotations.
 * @param {string} ms The string to parse from.
 * @param {boolean?} stripQuotes Removes quotes after parsing.
 * @returns string
 */
function parseQuotes(str: string, stripQuotes: boolean=false): string {
    const split:  string[] = str.split('');
    const parsed: string[] = [];
    let start = false;
    let i = 0;
    for (const char of split) {
        if (char === '"' && !start) {
            parsed.push(char);
            start = true;
        } else if (char === '"' && start) {
            if (split[i-1] == '\\') {
                parsed.push(char);
            } else {
                parsed.push(char);
                break;
            }
        } else if (/ +/.test(char) && start) {
            parsed.push(char);
        } else if (start) {
            parsed.push(char);
        }
    }
    if (parsed.length) {
        if (stripQuotes) {
            return parsed.join('').replace(/^"|"$/g, '');
        } else {
            return parsed.join('');
        }
    } else {
        return '';
    }
}

/**
 * Parses message flags into usable objects.
 * @param {string} str The string to parse from.
 * @param {Flag[]} flags The flags to parse.
 * @returns Flags Array
 */
function parseFlags(str: string, flags: FlagOptions[]): Readonly<Flag[]> {
    const parsed: Flag[] = [];
    let split = str.split(' ');

    flags.forEach(flag => {
        if (flag.type == 'string') {
            let holder: number = -1;
            split.forEach((word, i) => {
                if (word == '-'+ flag.name) holder = i;
            });
            if (holder != -1) {
                if (flag.quotes) {
                    const res = parseQuotes(split.slice(holder).join(' '));
                    if (res.length) {
                        parsed.push({name: flag.name, value: res});
                        split = split.slice(holder+1);
                    } else {
                        parsed.push({name: flag.name, value: null});
                    }
                } else {
                    parsed.push({name: flag.name, value: split[holder+1]});
                }
            } else {
                parsed.push({name: flag.name, value: null});
            }
        } else if (flag.type == 'int') {
            let holder: number = -1;
            split.forEach(function (word, i) {
                if (word == '-'+ flag.name) holder = i;
            });
            if (holder != -1) {
                parsed.push({name: flag.name, value: split[holder+1]});
            } else {
                parsed.push({name: flag.name, value: null});
            }
        } else if (flag.type == 'bool') {
            if (str.includes('-'+ flag.name)) {
                parsed.push({name: flag.name, value: true});
            } else {
                parsed.push({name: flag.name, value: false});
            }
        } else if (flag.type == 'user') {
            let holder: number = -1;
            split.forEach((word, i) => {
                if (word == '-'+ flag.name) holder = i;
            });
            if (holder != -1) {
                const user = split[holder+1];
                if (/(?:<@!?)?\d{17,}>?/g.test(user ?? '')) {
                    parsed.push({name: flag.name, value: user.replace(/<@|!|>/g, '')});
                } else {
                    parsed.push({name: flag.name, value: null});
                }
            } else {
                parsed.push({name: flag.name, value: null});
            }
        } else if (flag.type == 'channel') {
            let holder: number = -1;
            split.forEach((word, i) => {
                if (word == '-'+ flag.name) holder = i;
            });
            if (holder != -1) {
                const channel = split[holder+1];
                if (/(?:<#)?\d{17,}>?/g.test(channel ?? '')) {
                    parsed.push({name: flag.name, value: channel.replace(/<#|>/g, '')});
                } else {
                    parsed.push({name: flag.name, value: null});
                }
            } else {
                parsed.push({name: flag.name, value: null});
            }
        } else {
            throw new TypeError('Invalid Type for Flag.');
        }
    });

    return parsed;
}

export { parseQuotes, parseFlags };