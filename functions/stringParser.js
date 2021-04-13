"use strict";
// Strings Parser (quotations and flags) for Radeon
//
// There will be NO support for the use of this file
// except for self-hosted instances of Radeon
// (which is not currently supported).
//
// © Radeon Development 2021 (GNU GPL v3)
// https://github.com/devnote-dev/Radeon

exports.__esModule = true;
exports.parseFlags = exports.parseQuotes = void 0;

/**
 * Parses arguments encased in quotations.
 * @param str The string to parse from.
 * @param stripQuotes Removes quotes after parsing.
 * @returns string
 */
function parseQuotes(str, stripQuotes) {
    var split = str.split(' ');
    var parsed = [];
    var start = false;
    var end = false;
    split.forEach(function (word) {
        if (end)
            return;
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
    }
    else {
        return parsed.join(' ');
    }
}
exports.parseQuotes = parseQuotes;

/**
 * Parses message flags into usable objects.
 * @param str The string to parse from.
 * @param flags The flags to parse.
 * @returns Flags Array
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
                        var conv = splitStr.slice(index_1);
                        if (conv.length > 1) {
                            res_1 = parseQuotes(conv.join(' ').trim(), true);
                        }
                        else {
                            res_1 = splitStr[index_1 + 1].replace(/^"|"$/g, '');
                        }
                        parsed.push({ name: flag.name, value: res_1 });
                    }
                }
            });
        }
        else if (flag.type == 'int') {
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
            throw new TypeError('Invalid Type for Flag.');
        }
    });
    return parsed;
}
exports.parseFlags = parseFlags;
