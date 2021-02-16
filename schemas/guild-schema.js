const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    guildID: {
        type:               String,
        required:           true
    },
    prefix:                 String,
    modLogs:{
        channel:            String,
        kicks:{
            type:           Boolean,
            default:        false
        },
        bans:{
            type:           Boolean,
            default:        false
        }
    },
    muteRole:               String,
    ignoredCommands:{
        type:               [String],
        default:            []
    },
    ignoredChannels:{
        type:               [String],
        default:            []
    },
    automod:{
        active:             Boolean,
        channel:            String,
        invites:            Boolean,
        rateLimit:          Boolean,
        massMention:{
            active:         Boolean,
            thres:{
                type:       Number,
                default:    5
            }
        },
        badWords:{
            active:         Boolean,
            list:{
                type:       [String],
                default:    []
            }
        }
    }
});

module.exports = mongoose.model('Guild', guildSchema, 'Guilds');
