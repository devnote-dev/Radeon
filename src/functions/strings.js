/**
 * Radeon Strings and Flags Parser
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

/**
 * Parses single and double quotes in a string and returns an array of the output.
 * @param {string} str The string to parse.
 * @returns {string[]} The parsed string(s).
 */
function parseQuotes(str) {
    const split = str.split('');
    const parsed = [];
    let temp = [];
    let start = false;
    let index = -1;

    for (const char of split) {
        index++;
        if (char === '"' || char === "'") {
            if (split[index-1] === '\\') {
                temp.push(char);
                continue;
            }
            if (start) {
                start = false;
                parsed.push(temp.join(''));
                temp = [];
            } else {
                start = true;
            }
            continue;
        }
        if (start) temp.push(char);
    }

    return parsed;
}

/**
 * Parses flags in a string and returns an object output.
 * @param {string} str The string to parse.
 * @returns {{ short: string[]; long: string[] }} The parsed flag(s).
 */
function parseAll(str) {
    const split = str.split('');
    const short = [];
    const long = [];
    let temp = [];
    let start = false;
    let index = -1;
    let _in = false;
    let type = 0;

    for (const char of split) {
        index++;
        if (char === '-') {
            if (split[index-1] === '\\' || split[index-2] === '\\') continue;
            type = start ? 2 : 1;
            start = true;
            temp.push(char);
        } else if (char === '"' || char === "'") {
            temp.push(char);
            if (_in) {
                _in = false;
                if (temp.length) (type === 1 ? short : long).push(temp.join(''));
                temp = [];
                type = 0;
            } else {
                _in = true;
            }
        } else if (char === ' ') {
            if (_in) {
                temp.push(char);
            } else {
                start = false;
                if (temp.length) (type === 1 ? short : long).push(temp.join(''));
                temp = [];
                type = 0;
            }
        } else {
            if (start) temp.push(char); else continue;
        }
    }
    if (temp.length) (type === 1 ? short : long).push(temp.join(''));

    return {
        short: short.map(f => f.slice(1)),
        long: long.map(f => f.slice(2))
    }
}

function parseType(obj, type) {
    switch (type) {
        case String:
            if (typeof obj === 'string') {
                if (obj.includes('"') || obj.includes("'")) return parseQuotes(obj)[0];
            }
            return String(obj);
        case Map:
            return new Map(Object.entries(obj));
        case Boolean:
            if (typeof obj === 'string') return obj.toLowerCase() === 'true' ? true : false;
            return Boolean(obj);
        default:
            return new type(obj);
    }
}

/**
 * Parses flags bound by context flag options.
 * @param {string[]} flags The flags to parse.
 * @param {object} ctx The context to parse values from.
 * @returns {Map<string, any>} The parsed context flags.
 */
function parseWithContext(flags, ctx) {
    const parsed = new Map();

    for (const flag of flags) {
        if (flag.includes('=')) {
            const [k, v] = flag.split('=');
            if (ctx[k]) {
                try {
                    const p = parseType(v, ctx[k]);
                    parsed.set(k, { value: v, parsed: p });
                } catch {
                    parsed.set(k, { value: v, parsed: null });
                }
            } else {
                parsed.set(k, { value: null, parsed: null });
            }
        } else {
            parsed.set(flag, { value: flag, parsed: true });
        }
    }

    for (const key of Object.keys(ctx)) {
        if (parsed.has(key)) continue;
        parsed.set(key, { value: null, parsed: null });
    }

    return parsed;
}

module.exports = {
    parseQuotes,
    parseAll,
    parseType,
    parseWithContext
}
