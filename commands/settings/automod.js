/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */ 

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
        if (!args.length) {
            const automod = await client.db('automod').get(message.guild.id);
            const channel = message.guild.channels.cache.get(automod.channel)?.toString();
            const everyone = message.guild.roles.cache.get(automod.everyoneRole)?.toString();
            const embed = new MessageEmbed()
                .setTitle('Automod Settings')
                .setDescription(
                    `The automod system is currently **${getState(automod.active, false)}**. `+
                    'See \`help automod\` on how to edit these settings.'
                )
                .addFields([
                    { name: 'Log Channel', value: channel || 'None Set', inline: true },
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
            return message.channel.send({ embeds:[embed] });
        }
    }
}

function getState(opt, e=true) {
    return opt
        ? (e ? '<:checkgreen:796925441771438080>' : '') + 'enabled'
        : (e ? '<:crossred:796925441490681889>' : '') + 'disabled';
}
