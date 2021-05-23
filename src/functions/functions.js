/**
 * Radeon General Functions
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


"use strict";
exports.__esModule = true;
exports.humanize = exports.isBotOwner = exports.isBotStaff = exports.toDurationDays = exports.toDurationLong = exports.toDurationDefault = exports.choose = void 0;
var config_json_1 = require("../../config.json");

/**
 * Converts a timestamp to a small humanized duration.
 * @param ms Milliseconds to convert from.
 * @returns string
 */
function toDurationDefault(ms) {
    ms = Date.now() - ms;
    var secs = Math.floor(ms / 1000) % 24;
    var mins = Math.floor(ms / 60000) % 60;
    var hours = Math.floor(ms / 3600000) % 24;
    var days = Math.floor(ms / 86400000);
    return "" + (days > 0 ? days + ' days ' : '') + hours + " hours " + mins + " minutes and " + secs + " seconds ago";
}
exports.toDurationDefault = toDurationDefault;

/**
 * Converts a timestamp to a long humanized duration.
 * @param ms Milliseconds to convert from.
 * @returns string
 */
function toDurationLong(ms) {
    ms = Date.now() - ms;
    var hours = Math.floor(ms / 3600000) % 24;
    var days = Math.floor(ms / 86400000);
    var weeks = Math.floor(ms / 6.048e+8);
    var month = Math.floor(ms / 2.628e+9);
    var years = Math.floor(ms / 3.154e+10);
    return "" + (years > 0 ? years + ' years ' : '') + (month > 0 ? month + ' months ' : '') + (weeks > 0 ? weeks + ' weeks ' : '') + days + " days and " + hours + " hours ago";
}
exports.toDurationLong = toDurationLong;

/**
 * Converts a timestamp to a days string.
 * @param ms Milliseconds to convert from.
 * @returns string
 */
function toDurationDays(ms) {
    var days = (Date.now() - ms) / 86400000;
    return days + " days ago";
}
exports.toDurationDays = toDurationDays;

function isBotStaff(id) {
    if (config_json_1.botOwners.includes(id) || config_json_1.botAdmins.includes(id))
        return true;
    else
        return false;
}
exports.isBotStaff = isBotStaff;

function isBotOwner(id) { return config_json_1.botOwners.includes(id); }
exports.isBotOwner = isBotOwner;

/**
 * Humanizes a Discord.Permissions bitfield to readable strings.
 * @param permissions Permissions to convert.
 * @returns string[]
 */
function humanize(permissions) {
    var perms = [];
    permissions.toArray().forEach(function (p) {
        var r = '';
        p.replace(/_/g, ' ').split(' ').forEach(function (w) {
            r += w.split('')[0] + w.slice(1).toLowerCase() + ' ';
        });
        perms.push(r.trim());
    });
    return perms;
}
exports.humanize = humanize;


/**
 * @param args args in the message
 * @param options what you want to find
 * @param not what the option cannot be 
 * @returns string
 */
function choose(args, options, not) {
    let choice = options[Math.floor(Math.random() * options.length)];
    if (!args)
        return choice;
    for (let option of options) {
        if (args.find(arg => option == arg && not !== arg))
            choice = option;
    }
    return choice;
}
exports.choose = choose;
