/**
 * Radeon General Functions
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


import { botOwners, botAdmins } from "../../config.json";
import { Permissions } from "discord.js";

/**
 * Converts a timestamp to a small humanized duration.
 * @param ms Milliseconds to convert from.
 * @returns string
 */
function toDurationDefault(ms: number): string {
    ms = Date.now() - ms;
    const secs:  number = Math.floor(ms / 1000) % 24;
    const mins:  number = Math.floor(ms / 60000) % 60;
    const hours: number = Math.floor(ms / 3600000) % 24;
    const days:  number = Math.floor(ms / 86400000);
    return `${days > 0 ? days +' days ' : ''}${hours} hours ${mins} minutes and ${secs} seconds ago`;
}

/**
 * Converts a timestamp to a long humanized duration.
 * @param ms Milliseconds to convert from.
 * @returns string
 */
function toDurationLong(ms: number): string {
    ms = Date.now() - ms;
    const hours: number = Math.floor(ms / 3600000) % 24;
    const days:  number = Math.floor(ms / 86400000);
    const weeks: number = Math.floor(ms / 6.048e+8);
    const month: number = Math.floor(ms / 2.628e+9);
    const years: number = Math.floor(ms / 3.154e+10);
    return `${years > 0 ? years +' years ' : ''}${month > 0 ? month +' months ' : ''}${weeks > 0 ? weeks +' weeks ' : ''}${days} days and ${hours} hours ago`;
}

/**
 * Converts a timestamp to a days string.
 * @param ms Milliseconds to convert from.
 * @returns string
 */
function toDurationDays(ms: number): string {
    const days: number = (Date.now() - ms) / 86400000;
    return `${days} days ago`;
}

function isBotStaff(id: string): boolean {
    if (botOwners.includes(id) || botAdmins.includes(id)) return true; else return false;
}

function isBotOwner(id: string): boolean { return botOwners.includes(id) }

/**
 * Humanizes a Discord.Permissions bitfield to readable strings.
 * @param permissions Permissions to convert.
 * @returns string[]
 */
function humanize(permissions: Permissions): string[] {
    let perms = [];
    permissions.toArray().forEach(p => {
        let r = '';
        p.replace(/_/g, ' ').split(' ').forEach(w => {
            r += w.split('')[0] + w.slice(1).toLowerCase() + ' ';
        });
        perms.push(r.trim());
    });
    return perms;
}

export {
    toDurationDefault,
    toDurationLong,
    toDurationDays,
    isBotStaff,
    isBotOwner,
    humanize
}