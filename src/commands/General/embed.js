/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');
const { parseAll, parseWithContext } = require('../../functions/strings');

const usage = 'embed <...Flags>\n--raw="message"\n--author="author message"\n--aicon="author iconURL"\n--thumb="thumbnail URL"\n'+
    '--title="title message"\n--url="title URL"\n--desc="description message"\n--color="HEX/DECIMAL"\n--image="image URL"\n'+
    '--footer="footer message"\n--ficon="footer iconURL"\n--ts (timestamp)';

module.exports = {
    name: 'embed',
    tag: 'Creates a custom embed via command flags',
    description: 'Creates a custom embed via command flags. All flags with arguments require "quotations".',
    usage,
    cooldown: 3,
    guildOnly: true,

    async run(client, message, args) {
        if (!args.length) return client.error(`Insufficient Arguments\n\`\`\`\n${usage}\n\`\`\``, message);
        const { long } = parseAll(args.raw.join(' '));
        const flags = parseWithContext(long, {
            raw: String,
            author: String,
            aicon: String,
            thumb: String,
            title: String,
            desc: String,
            color: String,
            image: String,
            footer: String,
            ficon: String,
            ts: Boolean
        });

        const embed = new MessageEmbed();
        let content, author, aicon, footer, ficon;
        for (const [k, v] of flags) {
            if (v.parsed === null) continue;
            if (k === 'raw') content = v.parsed;
            if (k === 'author') author = v.parsed;
            if (k === 'aicon') aicon = v.parsed;
            if (k === 'thumb') embed.setThumbnail(v.parsed);
            if (k === 'title') embed.setTitle(v.parsed);
            if (k === 'url') embed.setURL(v.parsed);
            if (k === 'desc') embed.setDescription(v.parsed);
            if (k === 'color') embed.setColor(v.parsed);
            if (k === 'image') embed.setImage(v.parsed);
            if (k === 'footer') footer = v.parsed;
            if (k === 'ficon') ficon = v.parsed;
            if (k === 'ts') embed.setTimestamp();
        }
        if (author && aicon) {
            embed.setAuthor(author, aicon);
        } else if (author && !aicon) {
            embed.setAuthor(author);
        } else if (!author && aicon) {
            embed.setAuthor('\u200b', aicon);
        }
        if (!embed.description) embed.setDescription('\u200b');
        if (footer && ficon) {
            embed.setFooter(footer, ficon);
        } else if (footer && !ficon) {
            embed.setFooter(footer);
        } else if (!footer && ficon) {
            embed.setFooter('\u200b', ficon);
        }

        try {
            return await message.channel.send({ content, embeds:[embed] });
        } catch (err) {
            return client.error(err.message, message);
        }
    }
}
