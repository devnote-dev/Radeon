const request = require('node-superfetch')
const { MessageEmbed } = require('discord.js');
const { YoutubeKey } = require("../../../config.json");

module.exports = {
    name: 'songavailable',
    aliases: ['songav', 'sav'],
    tag: 'Find what platforms have a song.',
    description: 'Find what platforms have a song.',
    usage: 'dare [pg|pg13|r] [d|irls]',
    cooldown: 5,
    run: async (client, message, args) => {
        if (!YoutubeKey) return client.errEmb("No youtube api key found")
        if (!args.length) return client.errEmb("Please provide a search", message)

        const embed = new MessageEmbed()
        .setColor(0x1e143b);

        let musicVideo = await request.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${args.join(" ")}&type=video&key=${YoutubeKey}`).then(res => res.body)
        if (!musicVideo.pageInfo.totalResults) return client.errEmb("No results", message);
        musicVideo = musicVideo.items[0]

        embed.setTitle(`Song Available - ${musicVideo.snippet.title}`);

        musicVideo = await request.get(`https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${musicVideo.id.videoId}`)}`).then(res => res.body);
        if (!musicVideo) return client.errEmb("No results", message);

        let desc = [];
        let allPlatformsData = musicVideo.linksByPlatform
        let allPlatformsNames = Object.keys(allPlatformsData);
        for (let platform of allPlatformsNames) {
            desc.push(`[${platform}](${allPlatformsData[platform].url})`);
        }
        let splitAt = Math.ceil(allPlatformsNames.length / 2);
        embed.addFields(
            {name: "_ _", value: desc.slice(0, splitAt).join("\n"), inline: true},
            {name: "_ _", value: desc.slice(splitAt).join("\n"), inline: true},
        );
        let thumbKeys = Object.keys(musicVideo.entitiesByUniqueId);
        embed.setThumbnail(musicVideo.entitiesByUniqueId[thumbKeys[0]].thumbnailUrl);

        return message.reply(embed);
    }
}