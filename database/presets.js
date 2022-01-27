/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */

const { prefix } = require('../config.json');

function newGuild(id) {
    return {
        guildId: id,
        prefix,
        deleteAfterExec: false,
        actionLog: '',
        bypassUsers: new Map(),
        bypassRoles: new Map(),
        ignoredLogChannels: [],
        ignoredCommandChannels: [],
        ignoredCommands: []
    }
}

function newAutomod(id) {
    return {
        guildId: id,
        active: false,
        channel: '',
        everyoneRole: id,
        modLogs:{
            channel: '',
            muteRole: '',
            muteReason: true,
            kicks: false,
            kickReason: false,
            bans: true,
            banReason: true
        },
        invites: false,
        links: false,
        spam: false,
        floods: false,
        zalgo: false,
        minAge:{
            active: false,
            limit: 0
        },
        names:{
            active: false,
            hoisted: false,
            zalgo: false,
            filter: false
        },
        mentions:{
            active: false,
            limit: 5,
            unique: false
        },
        filter:{
            active: false,
            list: []
        },
        overrides:{
            ignoredChannels: [],
            ignoredRoles: [],
            ignoredUsers: []
        },
        rulesets:{
            invites: 'w;w;m',
            links: 'm;k',
            spam: 'w;w;m',
            floods: 'w;m;k',
            names: 'w;w;m',
            mentions: 'w;w;m',
            filter: 'w;w;m',
            zalgo: 'w;m;k'
        }
    }
}

function newSchedules(id) {
    return {
        guildId: id,
        muted: new Map(),
        bans: new Map()
    }
}

function newWarns(id) {
    return {
        guildId: id,
        list: new Map()
    }
}

function newSettings(id) {
    return {
        clientId: id,
        maintenance: false,
        cycleStatus: true,
        lastStatus: '',
        bannedUsers: [],
        bannedServers: []
    }
}

module.exports = {
    newGuild,
    newAutomod,
    newWarns,
    newSchedules,
    newSettings
}
