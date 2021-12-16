/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */ 

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
    return res.join(' > ');
}
