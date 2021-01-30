const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'shard',
    description: 'Sends information on a shard of a specified server, or the shard it was triggered in.',
    usage: 'shard [Guild:ID]',
    guildOnly: true,
    run: async (client, message, args) => {
        let server = message.guild;
        if (args.length > 0) server = client.guilds.cache.get(args[0]);
        if (!server) return message.channel.send(client.errEmb('Invalid or Unknown Server ID.'));
        const shard = server.shard;
        switch (shard.status) {
            case 0:
                sstatus = 'Ready';
                break;
            case 1:
                sstatus = 'Connecting';
                break;
            case 2:
                sstatus = 'Reconnecting';
                break;
            case 3:
                sstatus = 'Idle';
                break;
            case 5:
                sstatus = 'Disconnected';
                break;
            case 7:
                sstatus = 'Identifying';
                break;
            case 8:
                sstatus = 'Resuming';
                break;
            default:
                sstatus = 'Unknown!';
        }
        const embed = new MessageEmbed()
        .setTitle('Shard Info')
        .addFields(
            {name: 'Guild', value: `${server.name} (ID ${server.id})`, inline: false},
            {name: 'Shard ID', value: shard.id, inline: true},
            {name: 'Shard Host', value: 'Unknown', inline: true},
            {name: 'Shard Ping', value: `${shard.ping}ms`, inline: true},
            {name: 'Shard Status', value: sstatus, inline: true}
        )
        .setColor(0x1e143b)
        .setFooter(`Triggered by ${message.author.tag}`, message.author.avatarURL());
        message.channel.send(embed);
    }
}
