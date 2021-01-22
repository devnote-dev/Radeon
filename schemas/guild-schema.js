const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    guildID: {
        type:       String,
        required:   true
    },
    prefix:         String,
    ignoredCommands: {
        type:       [String],
    },
    ignoredChannels: {
        type:       [String],
    }
});

module.exports = mongoose.model('Guild', guildSchema, 'Guilds');
