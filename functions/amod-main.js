// Automod Main: message filter v2
// Current Issues: None
//
// Notes:
// - remove try{any}catch{void}

const { MessageEmbed } = require("discord.js");

function amodEmbed(message, user, channel) {
    return new MessageEmbed()
    .setTitle('Automod Triggered')
    .addFields(
        {name: 'Rule', value: message, inline: false},
        {name: 'User', value: `• ${user.tag}\n• ${user.id}`, inline: true},
        {name: 'Channel', value: `• ${channel}\n• ${channel.id}`, inline: true}
    )
    .setColor('ORANGE')
    .setTimestamp();
}

module.exports = async (client, message, automod) => {
    let channel;
    if (automod.channel) channel = message.guild.channels.cache.get(automod.channel);

    if (automod.invites) {
        const re = /(?:https?)?di?sc(?:ord)?\.(?:gg|com|invite)\/([\/\w-]+)/gmi;
        const matches = re.exec(message.content);
        if (matches && matches.length) {
            const invites = await message.guild.fetchInvites();
            let notFromServer = false;
            if (invites.size) {
                invites.forEach(inv => notFromServer = matches[1] == inv.code);
            }
            if (notFromServer) {
                try {
                    message.delete().catch(()=>{});
                    if (channel) {
                        channel.send(amodEmbed(`Invite Code Sent: \`${matches[1]}\``, message.author, message.channel));
                    }
                    message.reply('Invites are not allowed here.');
                } catch (err) {
                    console.error(err);
                }
            }
        }

        if (automod.massMention.active) {
            if (message.mentions.users.size) {
                if (message.mentions.users.size >= automod.massMention.thres) {
                    message.delete().catch(()=>{});
                    if (channel) {
                        channel.send(amodEmbed(`${message.mentions.users.size} Mentioned Users`, message.author, message.channel));
                    }
                    message.reply('Avoid mass-mentioning users.');
                }
            }
        }
    }
}