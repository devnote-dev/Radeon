import { botOwners, botAdmins } from "../config.json";

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
    if (botOwners.includes(id) || botAdmins.includes(id)) return true;
    return false;
}

export { toDurationDefault, toDurationLong, toDurationDays, isBotStaff }