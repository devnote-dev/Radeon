require('discord.js');
const Guild = require('../schemas/guild-schema');
const Muted = require('../schemas/muted-schema');

exports.run = async (client, oldMem, newMem) => {
    const {guild} = oldMem;
    const {muteRole} = await Guild.findOne({guildID: guild.id});
    if (!muteRole) return;
    const {mutedList} = await Muted.findOne({guildID: guild.id});
    if (mutedList.length < 1) return;
    if (oldMem.roles.cache.has(muteRole) && !newMem.roles.cache.has(muteRole) && mutedList.includes(newMem.user.id)) {
        newMem.roles.add(muteRole).catch(()=>{});
    }
}
