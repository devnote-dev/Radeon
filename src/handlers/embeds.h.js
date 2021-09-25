/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { Message, MessageEmbed } = require('discord.js');

module.exports = async client => {
    client.check = (msg, ctx, ttl) => {
        const e = new MessageEmbed()
            .setDescription(msg)
            .setColor(0x00d134);
        if (ctx instanceof Message) {
            return ctx.channel.send({ embeds:[e] }).then(m => {
                if (ttl) setTimeout(() => m.delete(), ttl * 1000);
            });
        } else {
            return ctx.send({ embeds:[e] }).then(m => {
                if (ttl) setTimeout(() => m.delete(), ttl * 1000);
            });
        }
    }

    client.error = (msg, ctx, ttl) => {
        const e = new MessageEmbed()
            .setDescription(msg)
            .setColor(0xd10000);
        let m;
        if (ctx instanceof Message) {
            ctx.channel.send({ embeds:[e] }).then(m => {
                if (ttl) setTimeout(() => m.delete(), ttl * 1000);
            });
        } else {
            return ctx.send({ embeds:[e] }).then(m => {
                if (ttl) setTimeout(() => m.delete(), ttl * 1000);
            });
        }
    }

    client.info = (msg, ctx, ttl) => {
        const e = new MessageEmbed()
            .setDescription('<:info:846179402773168159> '+ msg)
            .setColor(0x0054d1);
        if (ctx instanceof Message) {
            return ctx.channel.send({ embeds:[e] }).then(m => {
                if (ttl) setTimeout(() => m.delete(), ttl * 1000);
            });
        } else {
            return ctx.send({ embeds:[e] }).then(m => {
                if (ttl) setTimeout(() => m.delete(), ttl * 1000);
            });
        }
    }
}
