/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { Schema, model } = require('mongoose');

const guildSchema = Schema({
    guildID:{
        type:                   String,
        required:               true
    },
    prefix:                     String,
    muteRole:                   String,
    everyoneRole:               String,
    deleteAfterExec:            Boolean,
    actionLog:                  String,
    modLogs:{
        channel:                String,
        kicks:                  Boolean,
        bans:                   Boolean,
        kickReason:{
            type:               Boolean,
            default:            false
        },
        banReason:{
            type:               Boolean,
            default:            true
        }
    },
    automod:{
        active:                 Boolean,
        channel:                String,
        invites:                Boolean,
        ratelimit:              Boolean,
        mentions:{
            active:             Boolean,
            threshold:{
                type:           Number,
                default:        5
            },
            unique:{
                type:           Boolean,
                default:        false
            }
        },
        filter:{
            active:             Boolean,
            list:{
                type:           [String],
                default:        []
            }
        },
        zalgo:{
            active:             Boolean,
            threshold:{
                type:           Number,
                default:        50
            }
        },
        displayNames:           Boolean,
        rulesets:{
            type:               Map,
            default:            new Map()
        }
    },
    overrides:{
        roleBypass:{
            type:               Map,
            default:            new Map()
        },
        ignoredLogChannels:{
            type:               [String],
            default:            []
        },
        ignoredAutomodChannels:{
            type:               [String],
            default:            []
        },
        ignoredAutomodRoles:{
            type:               [String],
            default:            []
        },
        ignoredCmdChannels:{
            type:               [String],
            default:            []
        },
        ignoredCommands:{
            type:               [String],
            default:            []
        }
    }
});

module.exports = model('Guild', guildSchema, 'Guilds');
