"use strict";
exports.__esModule = true;
exports.parseFlags = exports.parseQuotes = void 0;
/**
 * Parses arguments encased in quotations.
 * @param str The string to parse from.
 * @param stripQuotes Removes quotes after parsing.
 */
function parseQuotes(str, stripQuotes) {
    var parsed = [''];
    var start = false;
    var end = false;
    var splitStr = str.split(' ');
    splitStr.forEach(function (word) {
        if (end)
            return;
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
    }
    else {
        return parsed.join(' ').trim();
    }
}
exports.parseQuotes = parseQuotes;
/**
 * Parses message flags into usable objects.
 * @param str The string to parse from.
 * @param flags The flags to parse.
 */
function parseFlags(str, flags) {
    var parsed = [];
    var splitStr = str.split(' ');
    flags.forEach(function (flag) {
        if (flag.type == 'string') {
            var res_1;
            var index_1;
            splitStr.forEach(function (word) {
                if (word == '-' + flag.name) {
                    index_1 = splitStr.indexOf(word);
                    if (index_1 >= splitStr.length) {
                        parsed.push({ name: flag.name, value: null });
                        // fallback for string is not trimmed
                    }
                    else {
                        if (flag.quote)
                            res_1 = parseQuotes(splitStr.slice(index_1).join(' '), true);
                        else
                            res_1 = splitStr[index_1 + 1];
                        parsed.push({ name: flag.name, value: res_1 });
                    }
                }
            });
        }
        else if (flag.type == 'int') {
            var temp = [];
            splitStr.forEach(function (word) {
                if (word == '-' + flag.name) {
                    if (splitStr.indexOf(word) < splitStr.length) {
                        var res = parseInt(splitStr[splitStr.indexOf(word) + 1]);
                        if (isNaN(res)) {
                            parsed.push({ name: flag.name, value: null });
                        }
                        else {
                            parsed.push({ name: flag.name, value: res });
                        }
                    }
                }
            });
        }
        else if (flag.type == 'bool') {
            if (splitStr.includes('-' + flag.name)) {
                parsed.push({ name: flag.name, value: true });
            }
        }
        else {
            throw new Error('Invalid Type for Flag.');
        }
    });
    return parsed;
}
exports.parseFlags = parseFlags;
