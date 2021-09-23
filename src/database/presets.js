/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { prefix } = require('../../config.json');

exports.guild = (id) => {
    return {
        guildID: id,
        prefix,
        deleteAfterExec: false,
        actionLog: ''
    }
}

exports.automod = (id) => {
    return {
        guildID: id,
        active: true,
        everyoneRole: id,
        mute:{
            role: '',
            reason: true
        },
        modlogs:{
            channel: '',
            kicks: false,
            kickReason: true,
            bans: false,
            banReason: true
        },
        channel: '',
        invites: false,
        ratelimit: false,
        floods: false,
        displayNames: false,
        mentions:{
            active: false,
            threshold: 5
        },
        filter:{
            active: false,
            list: []
        },
        zalgo:{
            active: false,
            threshold: 40
        },
        overrides:{
            bypassUsers: new Map(),
            bypassRoles: new Map(),
            ignoredLogChannels: [],
            ignoredAutomodChannels: [],
            ignoredAutomodRoles: [],
            ignoredCmdChannels: [],
            ignoredCommands: []
        }
    }
}

exports.muted = (id) => {
    return {
        guildID: id,
        list: new Map()
    }
}

exports.warns = (id) => {
    return {
        guildID: id,
        list: new Map()
    }
}
