const mongoose = require('mongoose');

const mutedSchema = mongoose.Schema({
    guildID: {
        type:       String,
        required:   true
    },
    mutedList:{
        type:       [String],
        default:    []
    }
});

module.exports = mongoose.model('MutedList', mutedSchema, 'Muted');
