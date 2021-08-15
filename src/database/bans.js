/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { Schema, model } = require('mongoose');

const banSchema = Schema({
    guilds:  [String],
    users:   [String]
});

module.exports = model('banlist', banSchema, 'Banned');
