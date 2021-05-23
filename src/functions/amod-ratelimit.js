/**
 * Automod Main: Ratelimiter
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

// Current Process for this:
// client.ratelimits is a collection of guild states, inside
// of the guild states is a collection of channel states, and
// inside the channel states is a collection of user ratelimit
// states. The userState is updated per execution:
//
//     id saved; check if exceeded limit -> bulkDelete & log; reset state;
//     AFTER: save userState to channelState; save channelState to guildState;
//     save guildState to client.ratelimits;

const { Collection, MessageEmbed } = require("discord.js");

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
    const { author } = message;
    let channel;
    if (automod.channel) channel = message.guild.channels.cache.get(automod.channel);

    if (client.ratelimits.has(message.guild.id)) {
        const guildState = client.ratelimits.get(message.guild.id);
        if (guildState.has(message.channel.id)) {
            const channelState = guildState.get(message.channel.id);
            if (channelState.has(author.id)) {
                const userState = channelState.get(author.id);
                userState.cache.push(message.id);
                const total = userState.cache.length;
                if (total > 5) {
                    if (userState.last < userState.limit) {
                        try {
                            await message.channel.bulkDelete(userState.cache);
                            console.log(`${message.guild.id}: amod clean`);
                            if (channel) channel.send(amodEmbed(`Sent ${total} Messages in ${(userState.limit - userState.last) / 1000} Seconds`, author, message.channel));
                        } catch {}
                    }
                    userState.cache = [];
                    userState.last  = Date.now();
                    userState.limit = Date.now() + 6000;
                    channelState.set(author.id, userState);
                    guildState.set(message.channel.id, channelState);
                    client.ratelimits.set(message.guild.id, guildState);
                } else {
                    userState.last = Date.now();
                    channelState.set(author.id, userState);
                    guildState.set(message.channel.id, channelState);
                    client.ratelimits.set(message.guild.id, guildState);
                }
            } else {
                const nState = { cache:[message.id], last:Date.now(), limit:Date.now()+6000 };
                channelState.set(author.id, nState);
                guildState.set(message.channel.id, channelState);
                client.ratelimits.set(message.guild.id, guildState);
            }
        } else {
            const nUserState = { cache:[message.id], last:Date.now(), limit:Date.now()+6000 };
            const nChanState = new Collection().set(author.id, nUserState);
            client.ratelimits.set(message.channel.id, nChanState);
        }
    } else {
        const nUState = { cache:[message.id], last:Date.now(), limit:Date.now()+6000 };
        const nCState = new Collection().set(author.id, nUState);
        const nGState = new Collection().set(message.channel.id, nCState);
        client.ratelimits.set(message.guild.id, nGState);
    }
}