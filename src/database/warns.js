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
    warnList:{
        type:       Map,
        default:    new Map()
    }
});

module.exports = model('Warns', warnSchema, 'Warns');
