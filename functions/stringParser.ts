type FlagOptions = {
    name:   string;
    type:   'string'|'int'|'bool';
    quote?: boolean;
}

type Flag = {
    name:  string;
    value: any;
}

/**
 * Parses arguments encased in quotations.
 * @param str The string to parse from.
 * @param stripQuotes Removes quotes after parsing.
 */
function parseQuotes(str: string, stripQuotes?: boolean) {
    let parsed = [''];
    let start = false;
    let end   = false;
    const splitStr = str.split(' ');
    splitStr.forEach(word => {
        if (end) return;
        if (word.startsWith('"') && word.endsWith('"')) {
            return parsed.push(word);
        }
        if (word.startsWith('"')) {
            parsed.push(word);
            start = true;
        }
        if (!word.startsWith('"') && start && !word.endsWith('"')) {
            parsed.push(word);
        }
        if (word.endsWith('"')) {
            parsed.push(word);
            end = true;
        }
    });
    if (stripQuotes) {
        return parsed.join(' ').trim().replace(/^"|"$/g, '');
    } else {
        return parsed.join(' ').trim();
    }
}

/**
 * Parses message flags into usable objects.
 * @param str The string to parse from.
 * @param flags The flags to parse.
 */
function parseFlags(str: string, flags: FlagOptions[]) {
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
                        if (flag.quote) res = parseQuotes(splitStr.slice(index).join(' '), true);
                        else res = splitStr[index+1];
                        parsed.push({name: flag.name, value: res});
                    }
                }
            });

        } else if (flag.type == 'int') {
            let temp = [];
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
            throw new Error('Invalid Type for Flag.');
        }
    });

    return parsed;
}

export { parseQuotes, parseFlags }