"use strict";
exports.__esModule = true;
exports.humanize = exports.isBotOwner = exports.isBotStaff = exports.toDurationDays = exports.toDurationLong = exports.toDurationDefault = void 0;
var config_json_1 = require("../config.json");
function toDurationDefault(ms) {
    var secs = Math.floor((ms / 1000) % 60).toString();
    var mins = Math.floor((ms / 1000 * 60) % 60).toString();
    var hours = Math.floor((ms / 1000 * 60 * 60) % 24).toString();
    var days = Math.floor((ms / 1000 * 60 * 60 * 24) % 60).toString();
    return days + " days " + hours + " hours " + mins + " minutes and " + secs + " seconds";
}
exports.toDurationDefault = toDurationDefault;
function toDurationLong(ms) {
    var mins = Math.floor((ms / 1000 * 60) % 60).toString();
    var hours = Math.floor((ms / 1000 * 60 * 60) % 24).toString();
    var days = Math.floor((ms / 1000 * 60 * 60 * 24) % 60).toString();
    var months = Math.floor((ms / 1000 * 60 * 60 * 24 * 7 * 4) % 60).toString();
    var years = Math.floor((ms / 1000 * 60 * 60 * 24 * 7 * 4 * 12) % 60).toString();
    return years + " years " + months + " months " + days + " days " + hours + " hours and " + mins + " minutes";
}
exports.toDurationLong = toDurationLong;
function toDurationDays(ms) {
    var days = (Date.now() - ms) / 86400000;
    return days + " days ago";
}
exports.toDurationDays = toDurationDays;
function isBotStaff(id) {
    if (config_json_1.botOwners.includes(id) || config_json_1.botAdmins.includes(id))
        return true;
    return false;
}
exports.isBotStaff = isBotStaff;
function isBotOwner(id) {
    if (config_json_1.botOwners.includes(id))
        return true;
    return false;
}
exports.isBotOwner = isBotOwner;
function humanize(permissions) {
    var permStr = [];
    permissions.toArray().forEach(function (p) {
        var r = '';
        p.replace(/_/g, ' ').split(' ').forEach(function (w) {
            r += w.split('')[0] + w.slice(1).toLowerCase() + ' ';
        });
        permStr.push(r.trim());
    });
    return permStr.join('`, `');
}
exports.humanize = humanize;
