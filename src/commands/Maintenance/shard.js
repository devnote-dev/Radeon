/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');
const { toDurationDefault } = require('../../dist/functions');

module.exports = {
    name: 'shard',
    tag: 'Sends info on a shard',
    description: 'Sends information on a shard of a specified server, or the shard it was triggered in.',
    usage: 'shard [Guild:ID]',
    cooldown: 2,
    guildOnly: true,
    run(client, message, args) {
        let server = message.guild;
        if (args.length) server = client.guilds.cache.get(args[0]);
        if (!server) return client.errEmb('Invalid or Unknown Server ID.', message);
        if (!server.available) return client.errEmb('This Guild is Unavailable at this time.', message);

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
            {name: 'Status', value: sstatus, inline: true},
            {name: 'Ping', value: `${shard.ping}ms`, inline: true},
            {name: 'Last Ping', value: toDurationDefault(shard.lastPingTimestamp), inline: true}
        )
        .setColor(0x1e143b)
        .setFooter(`Triggered by ${message.author.tag}`, message.author.displayAvatarURL());
        return message.channel.send(embed);
    }
}
