/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

exports.run = async (client, oldMem, newMem) => {
    const { guild } = oldMem;
    const gData = await client.db('guild').get(guild.id);
    if (!gData?.automod?.mute?.role) return;
    const mData = await client.db('muted').get(guild.id);
    if (!mData.list.length) return;
    const id = gData.automod.mute.role;
    if (newMem.partial) newMem = await newMem.fetch();
    if (
        oldMem.roles.cache.has(id) &&
        !newMem.roles.cache.has(id) &&
        mData.list.has(newMem.user.id)
    ) newMem.roles.add(id).catch(()=>{});
}
