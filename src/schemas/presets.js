/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { prefix } = require('../../config.json');

exports.guildPreset = guildID => { return {
    guildID,
    prefix,
    muteRole: '',
    everyoneRole: '',
    deleteAfterExec: false,
    actionLog: '',
    modLogs:{ channel: '' },
    automod:{
        active: false,
        channel: '',
        invites: false,
        ratelimit: false,
        mentions:{ active: false },
        filter:{ active: false },
        zalgo:{ active: false }
    }
}}
