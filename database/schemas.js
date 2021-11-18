const { Schema, model } = require('mongoose');

const Guild = Schema({
    guildId:{
        type:        String,
        required:    true
    },
    prefix:          String,
    deleteAfterExec: Boolean,
    actionLog:       String
});

const Automod = Schema({
    guildId:{
        type:                   String,
        required:               true
    },
    active:                     Boolean,
    channel:                    String,
    everyoneRole:               String,
    modLogs:{
        channel:                String,
        muteRole:               String,
        muteReason:             Boolean,
        kicks:                  Boolean,
        kickReason:             Boolean,
        bans:                   Boolean,
        banReason:              Boolean
    },
    invites:                    Boolean,
    spam:                       Boolean,
    floods:                     Boolean,
    names:{
        hoisted:                Boolean,
        zalgo:                  Boolean,
        filter:                 Boolean
    },
    links:                      Boolean,
    mentions:{
        active:                 Boolean,
        limit:                  Number,
        unique:                 Boolean
    },
    filter:{
        active:                 Boolean,
        list:                   [String]
    },
    zalgo:{
        active:                 Boolean,
        limit:                  Number
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
        links:                  String,
        mentions:               String,
        filter:                 String,
        zalgo:                  String
    }
});

const Schedules = Schema({
    guildId:{
        type: String,
        required: true
    },
    muted: Map,
    bans: Map
});

const Warns = Schema({
    guildId:{
        type: String,
        required: true
    },
    list: Map
});

const Settings = Schema({
    clientId:{
        type:      String,
        required:  true
    },
    maintenance:   Boolean,
    cycleStatus:   Boolean,
    lastStatus:    String,
    bannedUsers:   [String],
    bannedServers: [String]
});

module.exports = {
    Guild: model('Guild', Guild),
    Automod: model('Automod', Automod),
    Schedules: model('Schedules', Schedules),
    Warns: model('Warns', Wans),
    Settings: model('Settings', Settings)
}
