/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */

const cleanName = require('../automod/names');
const zalgo = require('../automod/zalgo');

const noop = () => {};

module.exports = async (client, _old, _new) => {
    if (_old.user.bot) return;
    if (_new.partial) await _new.fetch();
    const db = await client.db('automod').get(_old.guild.id);
    if (!db.active) return;

    if (db.modLogs.muteRole?.length) {
        const sch = await client.db('schedules').get(_old.guild.id);
        if (!sch.muted.has(_old.user.id)) return;
        if (_new.permissions.has(8n)) return;
        await _new.roles.add(db.modLogs.muteRole).catch(noop);
    }

    if (_old.displayName === _new.displayName) return;
    if (
        db.names.active &&
        (db.names.hoisted || db.names.zalgo || db.names.filter)
    ) {
        if (_new.permissions.has(8n)) return;
        if (db.names.filter) return; // TODO
        if (db.names.hoisted) return await cleanName(_new, db);
        if (db.names.zalgo) return await _new.setNickname(zalgo.clean(_new.displayName)).catch(noop);
    }
}
