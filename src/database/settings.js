/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { Schema, model } = require('mongoose');

const Settings = Schema({
    client:{
        type:     String,
        required: true
    },
    maintenance:  Boolean,
    cycleStatus:  Boolean,
    lastStatus:   String
});

module.exports = model('Settings', Settings);
