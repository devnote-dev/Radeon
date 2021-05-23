/**
 * @author Crenshaw <https://github.com/Crenshaw1312>
 * @copyright Radeon Development 2021
 */


const { redditPost } = require('../../functions/reddit');
const { choose } = require('../../functions/functions')
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'meme',
    aliases: ['m'],
    tag: 'It\'s a meme...',
    description: 'Returns a random meme from reddit',
    usage: 'meme',
    cooldown: 5,
    async run(client, message, args) {
        let options = ['meme', 'dankmeme', 'memes', 'me_irl']
        if (args.length && options.includes(args[0])) options = [choose(args, options, null)]
        else if (args.length) return client.errEmb(`Invalid subreddit, valid options are:\n${options.join(', ').slice(this.length - 2)}`, message)

        let post = await redditPost(options)
        if (!post) return client.errEmb("No meme was found", message)

        const embed = new MessageEmbed()
        .setTitle(`${post.title}`)
        .setURL(`https://reddit.com${post.permalink}`)
        .setColor(0x1e143b)
        .setImage(post.url_overridden_by_dest)
        .setFooter(`👍 ${post.ups} 💬 ${post.num_comments} - ${post.subreddit_name_prefixed}`);
        return message.reply(embed);
    }
}