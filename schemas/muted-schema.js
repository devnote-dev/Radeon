const mongoose = require('mongoose');

const mutedSchema = mongoose.Schema({
    guildID: {
        type:       String,
        required:   true
    },
    mutedList:{
        type:       Map,
        default:    new Map()
    }
});

module.exports = mongoose.model('MutedList', mutedSchema, 'Muted');
