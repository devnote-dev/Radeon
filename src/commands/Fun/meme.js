const { redditPost } = require('../../functions/reddit');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'meme',
    aliases: ['m'],
    tag: 'It\'s a meme...',
    description: 'It gives you memes....',
    usage: 'meme',
    cooldown: 5,
    run: async (client, message, args) => {
       let post = await redditPost(['meme', 'dankmeme', 'memes', 'me_irl'])
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