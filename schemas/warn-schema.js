const mongoose = require('mongoose');

const warnSchema = mongoose.Schema({
    guildID:{
        type:      String,
        required:  true
    },
    userid:{
        type:      String,
        required:  true
    },
    reason:        String,
    mod?:          String,
    date?:          Date
});

module.exports = mongoose.model('Warns', warnSchema, 'Warns');