/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { Schema, model } = require('mongoose');

const Automod = Schema({
    guildID:{
        type:                   String,
        required:               true
    },
    active:                     Boolean,
    everyoneRole:               String,
    mute:{
        role:                   String,
        reason:                 Boolean
    },
    modlogs:{
        channel:                String,
        kicks:                  Boolean,
        kickReason:             Boolean,
        bans:                   Boolean,
        banReason:              Boolean
    },
    channel:                    String,
    invites:                    Boolean,
    ratelimit:                  Boolean,
    floods:                     Boolean,
    displayNames:               Boolean,
    mentions:{
        active:                 Boolean,
        threshold:              Number,
        unique:                 Boolean
    },
    filter:{
        active:                 Boolean,
        list:                   [String]
    },
    zalgo:{
        active:                 Boolean,
        threshold:              Number
    },
    overrides:{
        bypassUsers:            Map,
        bypassRoles:            Map,
        ignoredLogChannels:     [String],
        ignoredAutomodChannels: [String],
        ignoredAutomodRoles:    [String],
        ignoredCmdChannels:     [String],
        ignoredCommands:        [String]
    },
    rulesets:{
        invites:                String,
        ratelimit:              String,
        floods:                 String,
        displayNames:           String,
        mentions:               String,
        filter:                 String,
        zalgo:                  String
    }
});

module.exports = model('Automod', Automod);
