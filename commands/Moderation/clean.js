require('discord.js');

module.exports = {
    name: 'clean',
    aliases: ['cl','clear','purge'],
    description: 'Deletes a number of messages in a channel (min 1, max 100).',
    usage: 'clean <number>\nclean <number> [User:Mention/ID]\nclean <number> [-users]\nclean <number> [-bots]',
    guildOnly: true,
    permissions: ['MANAGE_MESSAGES'],
    run: async (client, message, args) => {
        if (args.length < 1) return message.channel.send(client.errEmb('No Number Specified\n```\nclean <number>\nclean <number> [User:Mention/ID]\nclean <number> [-users]\nclean <number> [-bots]\n```'));
        let num, sub;
        num = parseInt(args[0]);
        if (isNaN(num)) return message.channel.send(client.errEmb('No Number Specified.'));
        if (num < 1 || num > 100) return message.channel.send(client.errEmb('Number must be more than 1 and less than 100.'));
        if (num < 100) num += 1;
        if (args.length > 1) {
            if (message.mentions || /\d{17,19}/g.test(args[1])) {
                sub = message.mentions.users.first() || message.guild.member(args[1]).user || args[1];
                const tag = sub.tag ? sub.tag : sub;
                if (sub.id) sub = sub.id;
                try {
                    const mess = await message.channel.messages.fetch({limit:100});
                    let count = 0;
                    mess.forEach(msg => {
                        if (count > num) return;
                        if (msg.author.id === sub) {
                            msg.delete();
                            count++;
                        }
                    }).then(message.channel.send(client.successEmb(`Deleted ${num} message(s) from \`${tag}\``))).then(m => m.delete({timeout:4000}));
                } catch (err) {
                    message.channel.send(client.errEmb(err.message));
                }
            }
        } else {
            try {
                await message.channel.bulkDelete(num,{filterOld:true});
                const done = await message.channel.send(client.successEmb(`Deleted ${num} message(s)!`));
                done.delete({timeout:4000});
            } catch (err) {
                message.channel.send(client.errEmb(err.message));
            }
        }
    }
}
