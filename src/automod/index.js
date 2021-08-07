/**
 * Automod Index
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');

function AmodEmbed(msg, ctx) {
    return new MessageEmbed()
        .setTitle('Automod Triggered')
        .addFields(
            {name: 'Rule', value: msg, inline: false},
            {name: 'User', value: `• ${ctx.author.tag}\n• ${ctx.author.id}`, inline: true},
            {name: 'Channel', value: `• ${ctx.channel}\n• ${ctx.channel.id}`, inline: true}
        )
        .setColor('ORANGE');
}

function ActionEmbed(msg, ctx) {
    return new MessageEmbed()
        .setAuthor('Command Logged')
        .addFields(
            {name: 'Command', value: msg.join(' '), inline: false},
            {name: 'User', value: `• ${ctx.author.tag}\n• ${ctx.author.id}`, inline: true},
            {name: 'Channel', value: `• ${ctx.channel}\n• ${ctx.channel.id}`, inline: true}
        )
        .setColor(0x0054d1);
}

async function fetchHook(id, client) {
    if (client.hooks.cache.has(id)) return client.hooks.cache.get(id);
    const guild = client.guilds.cache.get(id);
    const hooks = await guild.fetchWebhooks();
    let hook = hooks.find(h => h.name === 'Radeon Autmod Logs');
    if (hook) {
        client.hooks.cache.set(id, hook);
        return hook;
    }
    hook = await guild.createWebhook('Radeon Automod Logs', {
        avatar: client.user.avatarURL(),
        reason: 'Automod: Automatic Hook Generated'
    });
    client.hooks.cache.set(id, hook);
    return hook;
}

function handleActionLog(log, msg, ctx) {
    if (!log) return;
    if (!ctx.guild.channels.cache.has(log)) return;
    const embed = AmodEmbed(msg, ctx);
    let dghooks = ctx.client.hooks.digest.get(ctx.guild.id);
    if (!dghooks) {
        ctx.client.hooks.digest.set(ctx.guild.id, [embed]);
        return;
    }
    ctx.client.hooks.digest.set(ctx.guild.id, dghooks.push(embed));
}

exports.AmodEmbed = AmodEmbed;
exports.ActionEmbed = ActionEmbed;
exports.fetchHook = fetchHook;
exports.handleActionLog = handleActionLog;
