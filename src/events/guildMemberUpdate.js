/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


exports.run = async (client, oldMem, newMem) => {
    const { guild } = oldMem;
    const gData = await client.db('guild').get(guild.id);
    if (!gData || !gData.muteRole) return;
    const mData = await client.db('muted').get(guild.id);
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
