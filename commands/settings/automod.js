/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */ 

const { resolve } = require('../../util');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'automod',
    tag: 'Manage server automod config',
    description: 'Manages the server automod configuration.',
    usage: 'automod channel <Channel:Mention/ID>\nautomod channel reset\n'+
        'automod role <Role:Name/Mention/ID>\nautomod role reset\n'+
        'automod toggle <all|automod|Module>\nautomod mentions\nautomod names',
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

        const sub = args.lower[0], option = args.lower[1];

        if (sub === 'channel') {
            if (!option) return client.error(
                [
                    'Insufficient Arguments',
                    '||automod channel <Channel:Mention/ID>\nautomod channel reset||'
                ],
                channel
            );
            if (option === 'reset') {
                await client.db('automod').update(guild.id, { channel: '' });
                return client.check('Successfully reset the automod log channel!', channel);
            }
            let chan = resolve(option, 'channel', guild);
            if (!chan) return client.error('Channel not found.', channel);
            if (chan.type !== 'GUILD_TEXT') return client.error('Channel is not a default text channel.', channel);
            if (!chan.permissionsFor(guild.me).has(536870912n))
                return client.error('I don\'t have webhook permissions for that channel.', channel);
            await client.db('automod').update(guild.id, { channel: chan.id });
            return client.check(`Successfully set the automod log channel to ${chan}!`, channel);

        } else if (sub === 'role') {
            if (!option) return client.error(
                [
                    'Insufficient Arguments',
                    '||automod role <Role:Name/Mention/ID>\nautomod role reset||'
                ],
                channel
            );
            if (option === 'reset') {
                await client.db('automod').update(guild.id, { everyoneRole: guild.id });
                return client.check('Successfully reset the member role!', channel);
            }
            let role = resolve(option, 'role', guild);
            if (!role) return client.error('Role not found.', channel);
            await client.db('automod').update(guild.id, { everyoneRole: role.id });
            return client.check(`Successfully set the member role to ${role}!`, channel);

        } else if (sub === 'toggle') {
            if (!option) return client.error(
                [
                    'Error: No module specified',
                    '||all, automod, invites, links, spam, floods, zalgo, age, '+
                    'usernames, mentions, filter||'
                ],
                channel
            );
            if (!['all', 'automod', 'invites', 'links', 'spam', 'floods', 'zalgo',
                'age', 'usernames', 'mentions', 'filter'].includes(option))
                    return client.error(
                        'Invalid subcommand specified. See `help automod` for more information',
                        channel
                    );

            const db = client.db('automod');
            const frozen = await db.get(guild.id);
            switch (option) {
                case 'all':{
                    const val = !frozen.active;
                    frozen.active = val;
                    frozen.invites = val;
                    frozen.links = val;
                    frozen.spam = val;
                    frozen.floods = val;
                    frozen.zalgo = val;
                    frozen.minAge.active = val;
                    frozen.names.active = val;
                    frozen.mentions.active = val;
                    frozen.filter.active = val;
                    await db.update(guild.id, frozen);
                    return client.check(`Successfully ${val ? 'enabled' : 'disabled'} all automod settings!`, channel);
                }
                case 'automod':{
                    await db.update(guild.id, { active: !frozen.active });
                    return client.check(`Successfully ${frozen.active ? 'disabled' : 'enabled'} the automod system!`, channel);
                }
                case 'age':{
                    frozen.minAge.active = !frozen.minAge.active;
                    await db.update(guild.id, frozen);
                    return client.check(`Successfully ${frozen.minAge.active ? 'enabled' : 'disabled'} the age gate module!`, channel);
                }
                case 'usernames':{
                    frozen.names.active = !frozen.names.active;
                    await db.update(guild.id, frozen);
                    return client.check(`Successfully ${frozen.names.active ? 'disabled' : 'enabled'} the usernames module!`, channel);
                }
                case 'mentions':
                case 'filter':{
                    await db.update(guild.id, { [option]:{ active: !frozen[option].active }});
                    return client.check(`Successfully ${frozen[option].active ? 'disabled' : 'enabled'} the ${option} module!`, channel);
                }
                default:{
                    await db.update(guild.id, { [option]: !frozen[option] });
                    return client.check(`Successfully ${frozen[option] ? 'disabled' : 'enabled' } the ${option} module!`, channel);
                }
            }

        } else if (sub === 'mentions') {
            if (!option) {
                const { mentions } = await client.db('automod').get(guild.id);
                const embed = new MessageEmbed()
                    .setTitle('Automod: Mentions Control')
                    .addFields([
                        { name: 'Enabled', value: mentions.active.toString(), inline: true },
                        { name: 'Limit', value: mentions.limit.toString(), inline: true },
                        { name: 'Unique', value: mentions.unique.toString(), inline: true }
                    ])
                    .setColor(client.const.col.def);
                return channel.send({ embeds:[embed] });
            }

            if (option === 'reset') {
                await client.db('automod').update(
                    guild.id,
                    {
                        mentions:{
                            limit: 5,
                            unique: false
                        }
                    }
                );
                return client.check('Successfully reset the mention module!', channel);

            } else if (option === 'unique') {
                const db = client.db('automod');
                const frozen = await db.get(guild.id);
                await db.update(
                    guild.id,
                    {
                        mentions:{
                            limit: frozen.mentions.limit,
                            unique: !frozen.mentions.unique
                        }
                    }
                );
                return client.check(
                    `Successfully ${frozen.mentions.unique ? 'disabled' : 'enabled'} `+
                    'unique filtering for mentions module!',
                    channel,
                );

            } else {
                if (/[^\d]+/g.test(option)) return client.error(
                    'Unknown subcommand option. See `help automod` for more information.',
                    channel
                );
                const num = parseInt(option);
                if (isNaN(num)) return client.error('Invalid number for mention limit.', channel);
                if (num < 1 || num > 50) return client.error('Mention limit must be between 1 and 50.', channel);
                const db = client.db('automod');
                const frozen = await db.get(guild.id);
                await db.update(
                    guild.id,
                    {
                        mentions:{
                            limit: num,
                            unique: frozen.mentions.unique
                        }
                    }
                );
                return client.check(`Successfully set the mention limit to ${num}!`, channel);
            }

        } else {
            return client.error('Unknown subcommand option. See `help automod` for more information.', channel);
        }
    }
}

function getState(opt, e=true) {
    return opt
        ? (e ? '<:checkgreen:796925441771438080>' : '') + 'enabled'
        : (e ? '<:crossred:796925441490681889>' : '') + 'disabled';
}
