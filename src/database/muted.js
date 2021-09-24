/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { Schema, model } = require('mongoose');

const Muted = Schema({
    guildID:{
        type:     String,
        required: true
    },
    list:         Map
});

module.exports = model('Muted', Muted);
