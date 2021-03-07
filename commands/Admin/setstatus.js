const activities = [
"PLAYING",
"STREAMING",
"LISTENING",
"WATCHING",
"CLEAR",
]

module.exports = {
    name: 'set-status',
    aliases: ['setstatus'],
    description: 'Sets bot\'s status.',
    guildOnly: false,
    modOnly: 'warn',
    run: async (client, message, args) => { 
        if(args[0]) {
            const activityType = args[0].toUpperCase();
            let activityName = args.slice(1).join(" ");
            if(activities.includes(activityType)) {
                if(activityType == "CLEAR") activityName = ""

                client.user.setActivity(activityName, {type: activityType})
                return client.successEmb(`Presence has been succesfully changed!`, message)
            } else {
                return client.errEmb(`Activity type provided by you is wrong!\n\n**Current activity types:**\n${activities.map(a => `\`${a}\``).join('\n')}`, message)
            }
        } else {
            return client.errEmb(`Correct usage: \`r!set-status <type> <name>\``, message)
        }
    }
}
