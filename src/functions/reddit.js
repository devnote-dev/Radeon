const request = require('node-superfetch')

exports.redditPost = void 0

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
exports.redditPost = redditPost