const { redditPost } = require('../../functions/reddit');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'joke',
    aliases: ['m'],
    tag: 'Haha funny joke',
    description: 'Returns a joke from reddit',
    usage: 'meme',
    cooldown: 5,
    run: async (client, message, args) => {
        let post = await redditPost(["jokes", "dadjokes", "antijokes", "meanjokes"]);
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