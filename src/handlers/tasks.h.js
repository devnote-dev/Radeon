/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { CronJob } = require('cron');
const { logError } = require('../dist/console');
const { fetchHook } = require('../automod');

module.exports = async client => {
    // Scheduled Mutes Handler
    const scheduleUnmuteCron = new CronJob('* * * * *', async () => {
        const remove = [];
        try {
            const mData = await client.db('muted').getAll();
            mData.forEach(async GS => {
                GS.mutedList.forEach((k,v) => {
                    if (k == null) return;
                    if (Date.now() > k) remove.push(v);
                });
                if (remove.length) {
                    const temp = GS.mutedList;
                    remove.forEach(i => temp.delete(i));
                    await client.db('muted').update(GS.guildID, { mutedList: temp });
                    remove.forEach(i => require('../commands/Moderation/unmute')._selfexec(client, GS.guildID, i));
                }
            });
            client.stats.background++;
        } catch (err) {
            logError(err, __filename);
        }
    });

    const scheduleStatusCron = new CronJob('*/15 * * * *', async () => {
        const state = await client.db('settings').get(client.user.id);
        if (!state || !state.cycleStatus || state.maintenance) return;
        const presences = [
            {name: '@Radeon help', type: 'WATCHING'},
            {name: 'Automod', type: 'PLAYING'},
            {name: 'r!invite to invite!', type: 'PLAYING'},
            {name: 'with Slash Commands', type: 'PLAYING'}
        ];
        const p = presences[Math.floor(Math.random() * presences.length)];
        await client.user.setActivity({ name: p.name, type: p.type });
    });

    const scheduleWHooksCron = new CronJob('*/20 * * * *', async () => {
        if (!client.hooks.digest.size) return;
        for (const [id, embeds] of client.hooks.digest) {
            const hook = await fetchHook(id, client);
            await hook.send('Radeon Automod Logs', {
                avatarURL: client.user.avatarURL(),
                embeds
            });
            client.hooks.digest.delete(id);
        }
    });

    scheduleUnmuteCron.start();
    scheduleStatusCron.start();
    scheduleWHooksCron.start();
}
