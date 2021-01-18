require('discord.js');

module.exports = {
    name: 'clean',
    aliases: ['cl','clear','purge'],
    description: 'Deletes a number of messages in a channel (min 1, max 100).',
    usage: 'clean <number> [User:Mention/ID]',
    guildOnly: true,
    permissions: ['MANAGE_MESSAGES'],
    run: async (client, message, args) => {
        if (args.length < 1) return message.channel.send(client.errEmb('No Number Specified\n```\clean <number> [User:Mention/ID]\n```'));
        let num, sub;
        num = parseInt(args[0]);
        if (isNaN(num)) return message.channel.send(client.errEmb('No Number Specified.'));
        if (num < 1 || num > 100) return message.channel.send(client.errEmb('Number must be more than 1 and less than 100.'));
        if (num < 100) num += 1;
        if (args.length > 1) {
            if (message.mentions) {
                sub = message.mentions.users.first();
                try {
                    message.channel.messages.fetch({limit:100}).then(msgs => msgs.map(m => m.author.id === sub.id ? m.delete() : null));
                    const done = await message.channel.send(client.successEmb(`Deleted ${num} message(s) from \`${sub.tag}\``));
                    done.delete({timeout:4000});
                } catch (err) {
                    console.log(err);
                }
            }
        } else {
            try {
                await message.channel.bulkDelete(num);
                const done = await message.channel.send(client.successEmb(`Deleted ${num} message(s)!`));
                done.delete({timeout:4000});
            } catch (err) {
                message.channel.send(client.errEmb(err));
            }
        }
    }
}
