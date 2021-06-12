/**
 * @author Crenshaw <https://github.com/Crenshaw1312>
 * @copyright Radeon Development 2021
 */


const { choose } = require('../../dist/functions')
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'joke',
    aliases: ['m'],
    tag: 'Haha funny joke',
    description: 'Returns a joke from reddit',
    usage: 'meme',
    cooldown: 5,
    async run(client, message, args) {

        let options = ["jokes", "dadjokes", "antijokes", "meanjokes"]
        if (args.length && options.includes(args[0])) options = [choose(args, options, null)]
        else if (args.length) return client.errEmb(`Invalid subreddit, valid options are:\n${options.join(', ').slice(this.length - 2)}`, message)

        let post = await redditPost(options);
        if (!post) return client.errEmb("No joke was returned", message);

        const embed = new MessageEmbed()
        .setTitle(post.title)
        .setURL(`https://reddit.com${post.permalink}`)
        .setColor(0x1e143b)
        .setDescription(`||${post.selftext}||`)
        .setFooter(`👍 ${post.ups} - ${post.subreddit_name_prefixed}`);
        message.reply(embed);
    }
}

async function redditPost(subReddits) {
    try {
        const random = subReddits[Math.floor(Math.random() * subReddits.length)];
        const [list] = await request.get(`https://www.reddit.com/r/${random}/random/.json`).then(res => res.body)
        const [post] = list.data.children;
        return post.data
    } catch (error) {
        return
    }
}
