/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @author Piter <https://github.com/piterxyz>
 * @copyright 2021 Radeon Development
 */

const { readdirSync } = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = (client) => {
    readdirSync('./commands/')
    .forEach(dir => {
        readdirSync(`./commands/${dir}/`)
        .forEach(file => {
            const cmd = require(`./commands/${dir}/${file}`);
            cmd.cat = dir;
            client.commands.set(cmd.name, cmd);
            if (cmd.aliases)
                cmd.aliases.forEach(a => client.aliases.set(a, cmd.name));
        });
    });

    readdirSync('./events/')
    .forEach(file => {
        const event = require(`./events/${file}`);
        client.on(file.split('.')[0], (...ctx) => event(client, ...ctx));
    });

    client.embed = () => {
        return new MessageEmbed().setColor(client.const.col.def);
    }

    client.check = async (msg, ctx, ttl) => {
        if (ctx.channel) ctx = ctx.channel;
        const e = client.embed()
            .setDescription(msg)
            .setColor(client.const.col.green);
        if (ttl) {
            const m = await ctx.send({ embeds:[e] });
            await new Promise(res => setTimeout(res, ttl));
            await m.delete();
        } else {
            return await ctx.send({ embeds:[e] });
        }
    }

    client.error = async (msg, ctx, ttl) => {
        if (ctx.channel) ctx = ctx.channel;
        const e = client.embed()
            .setDescription(msg)
            .setColor(client.const.col.red);
        if (ttl) {
            const m = await ctx.send({ embeds:[e] });
            await new Promise(res => setTimeout(res, ttl));
            await m.delete();
        } else {
            return await ctx.send({ embeds:[e] });
        }
    }
}
