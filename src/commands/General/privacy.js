/**
 * @author Devonte <https://github.com/devnote-dev>
 * @author Piter <https://github.com/piterxyz>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'privacy',
    tag: 'Sends Radeon\'s privacy policy.',
    description: 'Sends Radeon\'s privacy policy and information on data collected.',
    cooldown: 2,
    run(_, message) {
        const embed = new MessageEmbed()
        .setTitle('Radeon Privacy Policy')
        .addField('What data does Radeon collect?', 'Radeon collects general user data such as your username, ID, and presence status/activity data which is visible to all users in Discord. The bot also collects general server information such as member count, roles, channels, and permissions.')
        .addField('What is the data used for?', 'Radeon uses the data for commands such as the information commands, Maintenance commands, and Server Settings commands, as well as command logging.')
        .addField('Who has access to this data?', 'Information commands are public and may be used freely by users, the rest of the data is private, only accessible to the bot owners.')
        .addField('Is any data shared?', 'No, Radeon and the development team have no third-party affiliation, all data is kept private, excluding the public commands.')
        .addField('How do I remove my data?', 'Please join the [Support Server](https://discord.gg/xcZwGhSy4G) for more information on removing your data.')
        .setColor(0x1e143b)
        .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
        return message.channel.send(embed);
    }
}
