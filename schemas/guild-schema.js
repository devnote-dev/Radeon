const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    guildID: {
        type:       String,
        required:   true
    },
    prefix:         String,
    ignoredCommands: {
        type:       Array,
        default:    [String]
    },
    ignoredChannels: {
        type:       Array,
        default:    [String]
    }
});

module.exports = mongoose.model('Guild', guildSchema, 'Guilds');
