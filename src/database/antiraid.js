/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { Schema, model } = require('mongoose');

const antiraidSchema = Schema({
    guildID:{
        type:        String,
        required:    true
    },
    active:          Boolean,
    channel:         String,
    locked:          Boolean,
    syncWarns:       Boolean,
    syncBans:        Boolean,
    config:{
        thres:{
            type:    Number,
            default: 5
        },
        spammers:    Boolean,
        selfbots:    Boolean,
        raiders:     Boolean,
        alters:      Boolean
    }
});

module.exports = model('antiraid', antiraidSchema, 'AntiRaid');