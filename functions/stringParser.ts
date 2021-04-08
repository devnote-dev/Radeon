// Strings Parser (quotations and flags) for Radeon
//
// There will be NO support for the use of this file
// except for self-hosted instances of Radeon
// (which is not currently supported).
//
// © Radeon Development 2021 (GNU GPL v3)
// https://github.com/devnote-dev/Radeon


type FlagOptions = {
    name: string;
    type: 'string'|'int'|'bool';
}

type Flag = {
    name:  string;
    value: any;
}

/**
 * Parses arguments encased in quotations.
 * @param str The string to parse from.
 * @param stripQuotes Removes quotes after parsing.
 * @returns string
 */
function parseQuotes(str: string, stripQuotes?: boolean): string {
    const split = str.split(' ');
    let parsed = [];
    let start = false;
    let end = false;

    split.forEach(word => {
        if (end) return;
        if (word.startsWith('"') && !word.endsWith('\\"') && word.endsWith('"')) {
            parsed.push(word);
            start = true;
            end = true;
        }
        if (word.startsWith('"') && !start) {
            parsed.push(word);
            start = true;
        }
        if (!word.startsWith('"') && !word.endsWith('"') && !word.endsWith('\\"') && start) {
            parsed.push(word);
        }
        if (word.endsWith('\\"')) {
            parsed.push(word);
        }
        if (word.endsWith('"') && !word.endsWith('\\"') && !end) {
            parsed.push(word);
            end = true;
        }
    });

    if (stripQuotes) {
        return parsed.join(' ').replace(/^"|"$/g, '');
    } else {
        return parsed.join(' ');
    }
}

/**
 * Parses message flags into usable objects.
 * @param str The string to parse from.
 * @param flags The flags to parse.
 * @returns Flags Array
 */
function parseFlags(str: string, flags: FlagOptions[]): Readonly<Flag[]> {
    let parsed: Flag[] = [];
    const splitStr = str.split(' ');

    flags.forEach(flag => {
        if (flag.type == 'string') {
            let res: string;
            let index: number;

            splitStr.forEach(word => {
                if (word == '-'+ flag.name) {
                    index = splitStr.indexOf(word);
                    if (index >= splitStr.length) {
                        parsed.push({name: flag.name, value: null});
                        // fallback for string is not trimmed
                    } else {
                        const conv = splitStr.slice(index);
                        if (conv.length > 1) {
                            res = parseQuotes(conv.join(' ').trim(), true);
                        } else {
                            res = splitStr[index+1].replace(/^"|"$/g, '');
                        }
                        parsed.push({name: flag.name, value: res});
                    }
                }
            });

        } else if (flag.type == 'int') {
            splitStr.forEach(word => {
                if (word == '-'+ flag.name) {
                    if (splitStr.indexOf(word) < splitStr.length) {
                        let res = parseInt(splitStr[splitStr.indexOf(word)+1]);
                        if (isNaN(res)) {
                            parsed.push({name: flag.name, value: null});
                        } else {
                            parsed.push({name: flag.name, value: res});
                        }
                    }
                }
            });

        } else if (flag.type == 'bool') {
            if (splitStr.includes('-'+ flag.name)) {
                parsed.push({name: flag.name, value: true});
            }

        } else {
            throw new TypeError('Invalid Type for Flag.');
        }
    });

    return parsed;
}

export { parseQuotes, parseFlags }