import { botOwners, botAdmins } from "../config.json";
import { Permissions } from "discord.js";

function toDurationDefault(ms: number) {
    const secs:  string = Math.floor((ms / 1000) % 60).toString()
    const mins:  string = Math.floor((ms / 1000 * 60) % 60).toString()
    const hours: string = Math.floor((ms / 1000 * 60 * 60) % 24).toString()
    const days:  string = Math.floor((ms / 1000 * 60 * 60 * 24) % 60).toString()
    return `${days} days ${hours} hours ${mins} minutes and ${secs} seconds`;
}

function toDurationLong(ms: number) {
    const mins:   string = Math.floor((ms / 1000 * 60) % 60).toString()
    const hours:  string = Math.floor((ms / 1000 * 60 * 60) % 24).toString()
    const days:   string = Math.floor((ms / 1000 * 60 * 60 * 24) % 60).toString()
    const months: string = Math.floor((ms / 1000 * 60 * 60 * 24 * 7 * 4) % 60).toString()
    const years:  string = Math.floor((ms / 1000 * 60 * 60 * 24 * 7 * 4 * 12) % 60).toString()
    return `${years} years ${months} months ${days} days ${hours} hours and ${mins} minutes`;
}

function toDurationDays(ms: number) {
    const days: number = (Date.now() - ms) / 86400000;
    return `${days} days ago`;
}

function isBotStaff(id: string) {
    if (botOwners.includes(id) || botAdmins.includes(id)) return true; else return false;
}

function isBotOwner(id: string): boolean { return botOwners.includes(id) }

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