/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */ 

const { resolve } = require('../../util');
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');

module.exports = {
    name: 'automod',
    tag: 'Manage server automod config',
    description: 'Manages the server automod configuration.',
    usage: 'automod channel [Channel:Mention/ID]\nautomod role [Role:Name/Mention/ID]\n'+
        'automod toggle <Module|all|automod>\nautomod mentions [Limit:Number]\nautomod names',
    guildOnly: true,
    perms:{ bit: 32n },

    async run(client, message, args) {
        const { guild, channel } = message;

        if (!args.length) {
            const automod = await client.db('automod').get(guild.id);
            const chan = guild.channels.cache.get(automod.channel)?.toString();
            const everyone = guild.roles.cache.get(automod.everyoneRole)?.toString();
            const embed = new MessageEmbed()
                .setTitle('Automod Settings')
                .setDescription(
                    `The automod system is currently **${getState(automod.active, false)}**. `+
                    'See \`help automod\` on how to edit these settings.'
                )
                .addFields([
                    { name: 'Log Channel', value: chan || 'None Set', inline: true },
                    { name: 'Member Role', value: everyone, inline: true },
                    { name: 'Invites', value: getState(automod.invites), inline: true },
                    { name: 'Danger Links', value: getState(automod.links), inline: true },
                    { name: 'Anti-Spam', value: getState(automod.spam), inline: true },
                    { name: 'Anti-Flood', value: getState(automod.floods), inline: true },
                    { name: 'Zalgo', value: getState(automod.zalgo), inline: true },
                    { name: 'Age Gate', value: getState(automod.minAge.active), inline: true },
                    { name: 'Usernames', value: getState(automod.names.active), inline: true },
                    { name: 'Mentions', value: getState(automod.mentions.active), inline: true },
                    { name: 'Filter', value: getState(automod.filter.active), inline: true }
                ])
                .setColor(client.const.col.def);
            return channel.send({ embeds:[embed] });
        }

        const sub = args.lower[0], op1 = args.lower[1];

        if (sub === 'channel') {
            if (!op1) {
                await client.db('automod').update(guild.id, { channel: '' });
                return client.check('Successfully reset the automod log channel!', channel);
            }
            let chan = resolve(op1, 'channel', guild);
            if (!chan) return client.error('Channel not found.', channel);
            if (chan.type !== 'GUILD_TEXT') return client.error('Channel is not a default text channel.', channel);
            if (!chan.permissionsFor(guild.me).has(536870912n))
                return client.error('I don\'t have webhook permissions for that channel.', channel);
            await client.db('automod').update(guild.id, { channel: chan.id });
            return client.check(`Successfully set the automod log channel to ${chan}!`, channel);

        } else if (sub === 'role') {
            if (!op1) {
                await client.db('automod').update(guild.id, { everyoneRole: guild.id });
                return client.check('Successfully reset the member role!', channel);
            }
            let role = resolve(op1, 'role', guild);
            if (!role) return client.error('Role not found.', channel);
            await client.db('automod').update(guild.id, { everyoneRole: role.id });
            return client.check(`Successfully set the member role to ${role}!`, channel);

        } else if (sub === 'toggle') {
            if (!op1) return client.error(
                'No module specified:\n`'+
                ['all', 'automod', 'invites', 'links', 'spam', 'floods', 'zalgo',
                'age', 'usernames', 'mentions', 'filter'].join('`, `') +'`',
                channel
            );
            switch (op1) {
                case 'all':{
                    const db = client.db('automod');
                    const val = !db.active;
                    await db.update(
                        guild.id,
                        {
                            active: val,
                            invites: val,
                            links: val,
                            spam: val,
                            floods: val,
                            zalgo: val,
                            minAge:{ active: val },
                            names:{ active: val },
                            mentions:{ active: val },
                            filter:{ active: val }
                        }
                    );
                    return client.check(`Successfully ${val ? 'enabled' : 'disabled'} all automod settings!`, channel);
                }
                case 'automod':{
                    // TODO: need a more efficient method for this...
                }
            }
        }
    }
}

function getState(opt, e=true) {
    return opt
        ? (e ? '<:checkgreen:796925441771438080>' : '') + 'enabled'
        : (e ? '<:crossred:796925441490681889>' : '') + 'disabled';
}
