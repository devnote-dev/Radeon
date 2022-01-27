/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021-2022 Radeon Development
 */

const { Schema, model } = require('mongoose');

const Guild = Schema({
    guildId:{
        type:               String,
        required:           true
    },
    prefix:                 String,
    deleteAfterExec:        Boolean,
    actionLog:              String,
    bypassUsers:            Map,
    bypassRoles:            Map,
    ignoredLogChannels:     [String],
    ignoredCommandChannels: [String],
    ignoredCommands:        [String]
});

const Automod = Schema({
    guildId:{
        type:            String,
        required:        true
    },
    active:              Boolean,
    channel:             String,
    everyoneRole:        String,
    modLogs:{
        channel:         String,
        muteRole:        String,
        muteReason:      Boolean,
        kicks:           Boolean,
        kickReason:      Boolean,
        bans:            Boolean,
        banReason:       Boolean
    },
    invites:             Boolean,
    links:               Boolean,
    spam:                Boolean,
    floods:              Boolean,
    zalgo:               Boolean,
    minAge:{
        active:          Boolean,
        limit:           Number
    },
    names:{
        active:          Boolean,
        hoisted:         Boolean,
        zalgo:           Boolean,
        filter:          Boolean
    },
    mentions:{
        active:          Boolean,
        limit:           Number,
        unique:          Boolean
    },
    filter:{
        active:          Boolean,
        list:            [String]
    },
    overrides:{
        ignoredChannels: [String],
        ignoredRoles:    [String],
        ignoredUsers:    [String]
    },
    rulesets:{
        invites:         String,
        links:           String,
        spam:            String,
        floods:          String,
        names:           String,
        mentions:        String,
        filter:          String,
        zalgo:           String
    }
});

const UserRecord = Schema({
    userId:{
        type:     String,
        required: true
    },
    guilds:       Map,
    violations:   Map,
    flagged:      Boolean
});

const Schedules = Schema({
    guildId:{
        type:     String,
        required: true
    },
    muted:        Map,
    bans:         Map
});

const Warns = Schema({
    guildId:{
        type:     String,
        required: true
    },
    list:         Map
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
    Guild:      model('Guild', Guild),
    Automod:    model('Automod', Automod),
    UserRecord: model('UserRecord', UserRecord),
    Schedules:  model('Schedules', Schedules),
    Warns:      model('Warns', Warns),
    Settings:   model('Settings', Settings)
}
