/**
 * General Database Manager
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const Bans = require('./bans');
const Guild = require('./guild');
const Muted = require('./muted');
const Settings = require('./settings');
const Warnings = require('./warnings');

const DB = {
    bans: Bans,
    guild: Guild,
    muted: Muted,
    settings: Settings,
    warnings: Warnings
}

function Database(type) {
    if (type in DB) return new DBManager(DB[type]);
    throw new Error('Unknown Database Type.');
}

class DBManager {
    constructor(connector) {
        this._conn = connector;
    }

    async get(id) {
        if (typeof id !== 'string') throw new TypeError('Guild ID must be a string.');
        try {
            return await this._conn.findOne({ guildID: id });
        } catch {
            return null;
        }
    }

    async getAll() {
        try {
            return await this._conn.find();
        } catch {
            return null;
        }
    }

    create(id, data, result=false) {}

    async update(id, data, result=false) {
        if (typeof id !== 'string') throw new TypeError('Guild ID must be a string.');
        if (typeof data !== 'object') throw new TypeError('Database data must be an object.');
        const d = await this._conn.findOneAndUpdate(
            { guildID: id },
            { $set: data },
            { new: true }
        );
        return result ? d : null;
    }

    async delete(id, data, result=false) {
        if (typeof id !== 'string') throw new TypeError('Guild ID must be a string.');
        if (typeof data !== 'object') throw new TypeError('Database data must be an object.');
        const d = await this._conn.findOneAndDelete(
            { guildID: id },
            { $set: data },
            { new: true }
        );
        return result ? d : null;
    }
}

module.exports = Database;
