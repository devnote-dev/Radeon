/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */ 

const { newAutomod } = require('../../database/presets');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ruleset',
    aliases:['rules', 'rs'],
    tag: 'Manage server automod rulesets',
    description: 'Manages the server automod punishment rulesets.',
    usage: 'rulesets set <Module> <...Rule>\nrulesets reset <Module>',
    guildOnly: true,
    perms:{ bit: 32n },

    async run(client, { guild, channel }, args) {
        if (!args.length) {
            const { rulesets } = await client.db('automod').get(guild.id);
            const embed = new MessageEmbed()
                .setTitle('Automod Rulesets')
                .setDescription(
                    'Available ruleset triggers are __Warn__, __Mute__, __Kick__, and __Ban__. '+
                    'See `help rulesets` for more information.'
                )
                .addFields([
                    {name: 'Invites', value: parseRule(rulesets.invites), inline: true},
                    {name: 'Danger Links', value: parseRule(rulesets.links), inline: true},
                    {name: 'Spam', value: parseRule(rulesets.spam), inline: true},
                    {name: 'Floods', value: parseRule(rulesets.floods), inline: true},
                    {name: 'Usernames', value: parseRule(rulesets.names), inline: true},
                    {name: 'Mentions', value: parseRule(rulesets.mentions), inline: true},
                    {name: 'Filter', value: parseRule(rulesets.filter), inline: true},
                    {name: 'Zalgo', value: parseRule(rulesets.zalgo), inline: true}
                ])
                .setColor(client.const.col.def);
            return channel.send({ embeds:[embed] });
        }

        let sub = args.lower[0], option = args.lower[1];
        if (sub === 'set') {
            if (!['invites', 'links', 'spam', 'floods', 'zalgo',
            'usernames', 'mentions', 'filter'].includes(option)) {
                return client.error(
                    [
                        'Error: Invalid module specified',
                        '||invites, links, spam, floods, zalgo, usernames, mentions, filter||'
                    ],
                    channel
                );
            }

            if (args.length < 2)
                return client.error('No rules specified. See `help ruleset` for more information.', channel);

            const rules = args.lower.slice(2).map(r => r.replace(/,|;/g, ''));
            if (rules.some(r => !['warn', 'mute', 'kick', 'ban'].includes(r)))
                return client.error('Invalid rule specified. See `help ruleset` for more information.', channel);

            if (option === 'usernames') option = 'names';
            const db = client.db('automod');
            const { rulesets } = await db.get(guild.id);
            rulesets[option] = rules.map(r => r[0]).join(';');
            await db.update(guild.id, { rulesets });
            return client.check(`Successfully updated the ${option} ruleset!`, channel);

        } else if (sub === 'reset') {
            if (!['invites', 'links', 'spam', 'floods', 'zalgo',
            'usernames', 'mentions', 'filter'].includes(option)) {
                return client.error(
                    [
                        'Error: Invalid module specified',
                        '||invites, links, spam, floods, zalgo, usernames, mentions, filter||'
                    ],
                    channel
                );
            }

            if (option === 'usernames') option = 'names';
            const db = client.db('automod');
            const { rulesets } = await db.get(guild.id);
            const { rulesets: _default } = newAutomod(null);
            rulesets[option] = _default[option];
            await db.update(guild.id, { rulesets });
            return client.check(`Successfully reset the ${option} ruleset!`, channel);

        } else {
            return client.error('Invalid subcommand. See `help ruleset` for more information.', channel);
        }
    }
}

function parseRule(str) {
    const rules = {
        w: 'Warn',
        m: 'Mute',
        k: 'Kick',
        b: 'Ban'
    }
    const res = [];
    for (const r of str.split(';')) res.push(rules[r]);
    return '`'+ res.join(' > ') +'`';
}
