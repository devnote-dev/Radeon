/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { Schema, model } = require('mongoose');

const Guild = Schema({
    guildID:{
        type:        String,
        required:    true
    },
    prefix:          String,
    deleteAfterExec: Boolean,
    actionLog:       String
});

module.exports = model('Guild', Guild);
