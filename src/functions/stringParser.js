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


'use strict';
exports.__esModule = true;
exports.parseFlags = exports.parseQuotes = void 0;
/**
 * Parses arguments encased in quotations.
 * @param {string} ms The string to parse from.
 * @param {boolean?} stripQuotes Removes quotes after parsing.
 * @returns string
 */
function parseQuotes(str, stripQuotes) {
    if (stripQuotes === void 0) { stripQuotes = false; }
    var split = str.split('');
    var parsed = [];
    var start = false;
    split.forEach(function (char, i) {
        if (char == '"' && !start) {
            parsed.push(char);
            start = true;
        }
        else if (char == '"' && start) {
            if (split[i - 1] == '\\') {
                parsed.push(char);
            }
            else {
                parsed.push(char);
                start = false;
            }
        }
        else if (char == ' ' && start) {
            parsed.push(char);
        }
        else if (start) {
            parsed.push(char);
        }
    });
    if (parsed.length) {
        if (stripQuotes) {
            return parsed.join('').replace(/^"|"$/g, '');
        }
        else {
            return parsed.join('');
        }
    }
    else {
        return '';
    }
}
exports.parseQuotes = parseQuotes;
/**
 * Parses message flags into usable objects.
 * @param {string} str The string to parse from.
 * @param {Flag[]} flags The flags to parse.
 * @returns Flags Array
 */
function parseFlags(str, flags) {
    var parsed = [];
    var split = str.split(' ');
    flags.forEach(function (flag) {
        if (flag.type == 'string') {
            var holder_1 = -1;
            split.forEach(function (word, i) {
                if (word == '-' + flag.name)
                    holder_1 = i;
            });
            if (holder_1 != -1) {
                if (flag.quotes) {
                    var res = parseQuotes(split.slice(holder_1).join(' '));
                    if (res.length) {
                        parsed.push({ name: flag.name, value: res });
                    }
                    else {
                        parsed.push({ name: flag.name, value: null });
                    }
                }
                else {
                    parsed.push({ name: flag.name, value: split[holder_1 + 1] });
                }
            }
            else {
                parsed.push({ name: flag.name, value: null });
            }
        }
        else if (flag.type == 'int') {
            var holder_2 = -1;
            split.forEach(function (word, i) {
                if (word == '-' + flag.name)
                    holder_2 = i;
            });
            if (holder_2 != -1) {
                parsed.push({ name: flag.name, value: split[holder_2 + 1] });
            }
            else {
                parsed.push({ name: flag.name, value: null });
            }
        }
        else if (flag.type == 'bool') {
            if (str.includes('-' + flag.name)) {
                parsed.push({ name: flag.name, value: true });
            }
            else {
                parsed.push({ name: flag.name, value: false });
            }
        }
        else if (flag.type == 'user') {
            var holder_3 = -1;
            split.forEach(function (word, i) {
                if (word == '-' + flag.name)
                    holder_3 = i;
            });
            if (holder_3 != -1) {
                var user = split[holder_3 + 1];
                if (/(?:<@!?)?\d{17,}>?/g.test(user !== null && user !== void 0 ? user : '')) {
                    parsed.push({ name: flag.name, value: user.replace(/<@|!|>/g, '') });
                }
                else {
                    parsed.push({ name: flag.name, value: null });
                }
            }
            else {
                parsed.push({ name: flag.name, value: null });
            }
        }
        else if (flag.type == 'channel') {
            var holder_4 = -1;
            split.forEach(function (word, i) {
                if (word == '-' + flag.name)
                    holder_4 = i;
            });
            if (holder_4 != -1) {
                var channel = split[holder_4 + 1];
                if (/(?:<#)?\d{17,}>?/g.test(channel !== null && channel !== void 0 ? channel : '')) {
                    parsed.push({ name: flag.name, value: channel.replace(/<#|>/g, '') });
                }
                else {
                    parsed.push({ name: flag.name, value: null });
                }
            }
            else {
                parsed.push({ name: flag.name, value: null });
            }
        }
        else {
            throw new TypeError('Invalid Type for Flag.');
        }
    });
    return parsed;
}
exports.parseFlags = parseFlags;
