/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */

const { Guild, Automod, Schedules, Warns, Settings } = require('./schemas');

const DB = {
    guild: Guild,
    warns: Warns,
    automod: Automod,
    settings: Settings,
    schedules: Schedules
}

function Database(type) {
    if (type in DB) return new DBManager(DB[type]);
    throw new Error('Unknown Database Type.');
}

/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */

class DBManager {
    constructor(connector) {
        this._conn = connector;
    }

    async get(id) {
        if (typeof id !== 'string') throw new TypeError('Guild ID must be a string.');
        try {
            if (this._conn == DB.settings) return await this._conn.findOne({ clientId: id });
            return await this._conn.findOne({ guildId: id });
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

    async create(data, result=false) {
        if (typeof data !== 'object') throw new TypeError('Database data must be an object.');
        const d = await new this._conn(data).save();
        return result ? d : null;
    }

    async update(id, data, result=false) {
        if (typeof id !== 'string') throw new TypeError('Guild ID must be a string.');
        if (typeof data !== 'object') throw new TypeError('Database data must be an object.');
        const d = await this._conn.findOneAndUpdate(
            { guildId: id },
            { $set: data },
            { new: true }
        );
        return result ? d : null;
    }

    async push(id, data, result=false) {
        if (typeof id !== 'string') throw new TypeError('Guild ID must be a string.');
        if (typeof data !== 'object') throw new TypeError('Database data must be an object.');
        const d = await this._conn.findOneAndUpdate(
            { guildId: id },
            { $push: data },
            { new: true }
        );
        return result ? d : null;
    }

    async pull(id, data, result=false) {
        if (typeof id !== 'string') throw new TypeError('Guild ID must be a string.');
        if (typeof data !== 'object') throw new TypeError('Database data must be an object.');
        const d = await this._conn.findOneAndUpdate(
            { guildId: id },
            { $pull: data },
            { new: true }
        );
        return result ? d : null;
    }

    async delete(id, result=false) {
        if (typeof id !== 'string') throw new TypeError('Guild ID must be a string.');
        const d = await this._conn.findOneAndDelete({ guildId: id });
        return result ? d : null;
    }
}

module.exports = Database;
