/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { CronJob } = require('cron');
const { logError } = require('../console/consoleR');
const Muted = require('../schemas/muted-schema');

module.exports = async client => {
    // Scheduled Mutes Handler
    const scheduleUnmuteCron = new CronJob('* * * * *', async () => {
        const remove = [];
        try {
            const mData = await Muted.find();
            mData.forEach(async GS => {
                GS.mutedList.forEach((k,v) => {
                    if (k == null) return;
                    if (Date.now() > k) remove.push(v);
                });
                if (remove.length) {
                    const temp = GS.mutedList;
                    remove.forEach(i => temp.delete(i));
                    await Muted.findOneAndUpdate(
                        { guildID: GS.guildID },
                        { $set:{ mutedList: temp }},
                        { new: true }
                    );
                    remove.forEach(i => require('../commands/Moderation/unmute')._selfexec(client, GS.guildID, i));
                }
            });
            client.stats.background++;
        } catch (err) {
            logError(err, __filename);
        }
    });

    const scheduleStatusCron = new CronJob('* * * * 5', async () => {
        const presences = [
            {name: '@Radeon help', type: 'WATCHING'},
            {name: 'Automod', type: 'PLAYING'},
            {name: 'r!invite to invite!', type: 'PLAYING'},
            {name: 'with Slash Commands', type: 'PLAYING'}
        ];
        const p = presences[Math.floor(Math.random() * presences.length)];
        await client.user.setStatus({ name: p.name, type: p.type });
    });

    scheduleUnmuteCron.start();
    scheduleStatusCron.start();
}