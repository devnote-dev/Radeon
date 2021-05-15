require('discord.js');
const Guild = require('../schemas/guild-schema');
const Muted = require('../schemas/muted-schema');

exports.run = async (_, oldMem, newMem) => {
    const { guild } = oldMem;
    const gData = await Guild.findOne({ guildID: guild.id }).catch(()=>{});
    if (!gData || !gData.muteRole) return;
    const mData = await Muted.findOne({ guildID: guild.id }).catch(()=>{});
    if (!mData.mutedList.length) return;
    if (newMem.partial) newMem = await newMem.fetch();
    if (
        oldMem.roles.cache.has(gData.muteRole)
        && !newMem.roles.cache.has(gData.muteRole)
        && mData.mutedList.has(newMem.user.id)
    ) {
        newMem.roles.add(gData.muteRole).catch(()=>{});
    }
}
