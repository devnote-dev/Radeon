/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { Schema, model } = require('mongoose');

const Banned = Schema({
    guilds: [String],
    users:  [String]
});

module.exports = model('Banned', Banned);
