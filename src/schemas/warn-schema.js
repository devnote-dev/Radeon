/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { Schema, model } = require('mongoose');

const warnSchema = Schema({
    guildID:{
        type:      String,
        required:  true
    },
    userid:        String,
    reason:        String,
    mod:           String,
    date:          Date
});

module.exports = model('Warns', warnSchema, 'Warns');