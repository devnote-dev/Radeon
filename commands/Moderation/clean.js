require('discord.js');

module.exports = {
    name: 'clean',
    aliases: ['cl','clear','purge'],
    description: 'Deletes a number of messages in a channel (min 1, max 100).\n**Options:**\n`User:Mention/ID` - Deletes from a target user\n`-users` - Deletes only user messages\n`-bots` - Deletes only bot messages',
    usage: 'clean <number>\nclean <number> [User:Mention/ID]\nclean <number> [-users]\nclean <number> [-bots]',
    guildOnly: true,
    permissions: ['MANAGE_MESSAGES'],
    run: async (client, message, args) => {
        if (args.length < 1) return client.errEmb('No Number Specified\n```\nclean <number>\nclean <number> [User:Mention/ID]\nclean <number> [-users]\nclean <number> [-bots]\n```', message);
        let num, sub;
        num = parseInt(args[0]);
        if (isNaN(num)) return client.errEmb('No Number Specified.', message);
        if (num < 1 || num > 100) return client.errEmb('Number must be more than 1 and less than 100.', message);
        if (num < 100) num += 1;
        if (args.length > 1) {
            if (args[1] === '-users') {
                try {
                    const mess = await message.channel.messages.fetch({limit:100});
                    let count = 0;
                    await mess.forEach(msg => {
                        if (count > num) return;
                        if (msg.author.bot) return;
                        msg.delete();
                        count++;
                    })
                    const done = await client.checkEmb(`Deleted ${num} user message(s)!`, message)
                    done.delete({timeout:3000});
                } catch (err) {
                    console.log(err);
                    client.errEmb(err.message, message);
                }
            } else if (args[1] === '-bots') {
                try {
                    const mess = await message.channel.messages.fetch({limit:100});
                    let count = 0;
                    await mess.forEach(msg => {
                        if (count > num) return;
                        if (!msg.author.bot) return;
                        msg.delete();
                        count++;
                    })
                    const done = await client.checkEmb(`Deleted ${num} bot message(s)!`, message)
                    done.delete({timeout:3000});
                } catch (err) {
                    console.log(err);
                    client.errEmb(err.message, message);
                }
            } else if (message.mentions.users.size > 0 || /^\d{17,19}$/g.test(args[1])) {
                sub = message.mentions.users.first() || message.guild.member(args[1]) || args[1];
                const tag = sub.user ? sub.user.tag : sub;
                if (sub.id) sub = sub.id;
                try {
                    const mess = await message.channel.messages.fetch({limit:100});
                    let count = 0;
                    await mess.forEach(msg => {
                        if (count > num) return;
                        if (msg.author.id === sub) {
                            msg.delete();
                            count++;
                        }
                    })
                    const done = await client.checkEmb(`Deleted ${num} message(s) from \`${tag}\``, message)
                    done.delete({timeout:3000});
                } catch (err) {
                    console.log(err);
                    client.errEmb(err.message, message);
                }
            } else {
                return client.errEmb('Unknown UserResolvable or Flag Specified.', message);
            }
        } else {
            try {
                await message.channel.bulkDelete(num,{filterOld:true});
                await client.checkEmb(`Deleted ${num} message(s)!`, message).then(m => m.delete({timeout:3000}));
            } catch (err) {
                client.errEmb(err.message, message);
            }
        }
    }
}
