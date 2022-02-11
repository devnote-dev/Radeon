/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { Schema, model } = require('mongoose');

const Scheduled = Schema({
    guildID:{
        type:     String,
        required: true
    },
    muted:        Map,
    unbans:       Map
});

module.exports = model('Scheduled', Scheduled);
