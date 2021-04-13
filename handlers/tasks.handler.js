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
        } catch (err) {
            logError(err, __dirname);
        }
    });

    // Running here
    scheduleUnmuteCron.start();
}