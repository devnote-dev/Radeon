const { redditPost } = require('../../functions/reddit');
const { choose } = require('../../functions/functions')
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'joke',
    aliases: ['m'],
    tag: 'Haha funny joke',
    description: 'Returns a joke from reddit',
    usage: 'meme',
    cooldown: 5,
    run: async (client, message, args) => {

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