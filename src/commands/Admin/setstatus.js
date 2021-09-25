/**
 * @author Piter <https://github.com/piterxyz>
 * @copyright Radeon Development 2021
 */

const activities = [
    "PLAYING",
    "STREAMING",
    "LISTENING",
    "WATCHING",
    "CLEAR",
    "COMPETING"
];
const statuses = ['online', 'idle', 'dnd', 'offline'];

module.exports = {
    name: 'setstatus',
    aliases:['ss'],
    description: 'Sets Radeon\'s status.',
    guildOnly: false,
    modOnly: 4,

    async run(client, message, args) { 
        if (args.length < 2) return client.error('Insufficient Arguments\n```\nsetstatus <Type> <Name> [-online|-idle|-dnd]\n```', message);
        if (!activities.includes(args.upper[0])) return client.error('Unknown Status Type.', message);
        const type = args.upper[0];
        let name = args.raw.slice(1).join(' ');
        let status = 'online';
        statuses.forEach(s => {
            if (name.includes('-'+s)) {
                status = s;
                name = name.replace('-'+s, '');
            }
        });
        await client.user.setPresence({
            status,
            activities:[{
                name,
                type
            }]
        });
        return client.check('Successfully Updated Status!', message);
    }
}
