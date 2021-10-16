/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');
const { toDurationDefault } = require('../../functions');

module.exports = {
    name: 'shard',
    tag: 'Sends info on a shard',
    description: 'Sends information on a shard of a specified server, or the shard it was triggered in.',
    usage: 'shard [Guild:ID]',
    cooldown: 2,
    guildOnly: true,
    options:[{
        name: 'server',
        type: 'NUMBER',
        description: 'The server ID of the shard',
        required: false
    }],

    run(client, message, args) {
        let server = message.guild;
        if (args.length) server = client.guilds.cache.get(args.raw[0]);
        if (!server) return client.error('Invalid or unknown server ID.', message);
        if (!server.available) return client.error('This server is unavailable at this time.', message);

        const shard = server.shard;
        let sstatus;
        switch (shard.status) {
            case 0:
                sstatus = 'Ready'; break;
            case 1:
                sstatus = 'Connecting'; break;
            case 2:
                sstatus = 'Reconnecting'; break;
            case 3:
                sstatus = 'Idle'; break;
            case 5:
                sstatus = 'Disconnected'; break;
            case 7:
                sstatus = 'Identifying'; break;
            case 8:
                sstatus = 'Resuming'; break;
            default:
                sstatus = 'Unknown!'; break;
        }

        const embed = new MessageEmbed()
            .setTitle('Shard Info')
            .addFields(
                {name: 'Guild', value: server.name, inline: false},
                {name: 'ID', value: server.id.toString(), inline: false},
                {name: 'Shard ID', value: shard.id.toString(), inline: true},
                {name: 'Status', value: sstatus, inline: true},
                {name: 'Ping', value: `${shard.ping}ms`, inline: true},
                {name: 'Last Ping', value: toDurationDefault(shard.lastPingTimestamp), inline: true}
            )
            .setColor(0x1e143b)
            .setFooter(`Triggered by ${message.author.tag}`, message.author.displayAvatarURL());
        return message.channel.send({ embeds:[embed] });
    },

    slash(client, { message, options }) {
        const id = options.get('server')?.value;
        this.run(client, message, { raw: id ?? null });
    }
}
