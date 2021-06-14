/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { Schema, model } = require('mongoose');

const guildSchema = Schema({
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
    everyoneRole:           String,
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

module.exports = model('Guild', guildSchema, 'Guilds');
