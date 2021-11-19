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
        actionLog: ''
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
        minAge: false,
        names:{
            hoisted: false,
            zalgo: false,
            filter: false
        },
        mentions:{
            active: false,
            limit: false,
            unique: false
        },
        filter:{
            active: false,
            list: []
        },
        zalgo: false,
        overrides:{
            bypassUsers: new Map(),
            bypassRoles: new Map(),
            ignoredLogChannels: new Map(),
            ignoredAutomodChannels: new Map(),
            ignoredAutomodRoles: new Map(),
            ignoredCmdChannels: new Map(),
            ignoredCommands: new Map()
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
