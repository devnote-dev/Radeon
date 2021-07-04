/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { Schema, model } = require('mongoose');

const mutedSchema = Schema({
    guildID: {
        type:       String,
        required:   true
    },
    mutedList:{
        type:       Map,
        default:    new Map()
    }
});

module.exports = model('MutedList', mutedSchema, 'Muted');
