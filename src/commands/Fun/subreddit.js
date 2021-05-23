/**
 * @author Crenshaw <https://github.com/Crenshaw1312>
 * @copyright Radeon Development 2021
 */


const { redditPost } = require('../../functions/reddit');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'subreddit',
    aliases: ['subr'],
    tag: 'It\'s a meme...',
    description: 'Returns a random meme from reddit',
    usage: 'meme',
    cooldown: 5,
    async run(client, message, args) {
        if (!args.length) return client.errEmb("Please provide a subreddit to get a post from")
        let post = await redditPost([args[0]])
        if (!post) return client.errEmb(`No meme was found for r/${args[0]}`, message)

        const embed = new MessageEmbed()
        .setTitle(`${post.title}`)
        .setURL(`https://reddit.com${post.permalink}`)
        .setDescription(post.selftext)
        .setColor(0x1e143b)
        .setImage(post.url_overridden_by_dest)
        .setFooter(`👍 ${post.ups} 👎 ${post.downs} 💬 ${post.num_comments} - ${post.subreddit_name_prefixed}`);
        return message.reply(embed);
    }
}