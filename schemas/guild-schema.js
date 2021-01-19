const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    guildID: {
        type:       String,
        required:   true
    },
    prefix:         String,
    ignoredCommands: {
        type:       Array,
        default:    []
    },
    ignoredChannels: {
        type:       Array,
        default:    []
    }
});

module.exports = mongoose.model('Guild', guildSchema, 'Guilds');
