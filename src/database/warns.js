/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { Schema, model } = require('mongoose');

const Warns = Schema({
    guildID:{
        type:     String,
        required: true
    },
    list:{
        type:     Map,
        default:  new Map()
    }
});

module.exports = model('Warns', Warns);
