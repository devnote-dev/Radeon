/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { Schema, model } = require('mongoose');

const settingsSchema = Schema({
    client:{
        type:     String,
        required: true
    },
    maintenance:{
        type:    Boolean,
        default: false
    },
    cycleStatus:{
        type:    Boolean,
        default: true
    }
});

module.exports = model('settings', settingsSchema, 'Settings');