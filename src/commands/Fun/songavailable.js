const request = require('node-superfetch')
const { parseFlags } = require('../../functions/stringParser');
const { MessageEmbed } = require('discord.js');
const { YoutubeKey } = require("../../../config.json");

module.exports = {
    name: 'songavailable',
    aliases: ['songav', 'sav'],
    tag: 'Find what platforms have a song.',
    description: 'Find what platforms have a song\n\n**Flags**\n`-link` - specify a share link',
    usage: 'songavailable [song name|flag]',
    cooldown: 20,
    run: async (client, message, args) => {
        // flags
        let flags = parseFlags(args.join(" "), [
            {name: 'link', type: 'string', quotes: false},
        ])

        // set search to presence
        let spotifyActivity = message.member.presence.activities.find(activity => activity.name == 'Spotify' || activity.name.toLowerCase() == 'youtube music')
        if (spotifyActivity && !args.length) {
            args = [spotifyActivity.details, spotifyActivity.state]
        }

        // Quick - error
        if (!YoutubeKey) return client.errEmb("No youtube api key found")
        if (!args.length) return client.errEmb("Please provide a search", message)


        // get music video
        let musicVideo;
        let link;
        if (!flags[0].value) {
            let musicVideo = await request.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${args.join(" ")}&type=video&key=${YoutubeKey}`).then(res => res.body)
            if (!musicVideo.pageInfo.totalResults) return client.errEmb("No results", message);
            musicVideo = musicVideo.items[0]
            link = `https://www.youtube.com/watch?v=${musicVideo.id.videoId}`
        } else {
            link = flags[0].value
        }

        // use link to find on song.link to get all platforms
        musicVideo = await request.get(`https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(link)}`).then(res => res.body);
        if (!musicVideo) return client.errEmb("No results", message);

        // make good embed ree
        const embed = new MessageEmbed()
        .setColor(0x1e143b)
        let desc = []
        let allPlatformsData = musicVideo.linksByPlatform
        let allPlatformsNames = Object.keys(allPlatformsData)
        for (let platform of allPlatformsNames) {
            desc.push(`[${platform}](${allPlatformsData[platform].url})`)
        }
        let splitAt = Math.ceil(allPlatformsNames.length / 2)
        embed.addFields(
            {name: "_ _", value: desc.slice(0, splitAt).join("\n"), inline: true},
            {name: "_ _", value: desc.slice(splitAt).join("\n"), inline: true},
        );
        let songData = musicVideo.entitiesByUniqueId[Object.keys(musicVideo.entitiesByUniqueId)[0]]
        embed.setThumbnail(songData.thumbnailUrl)
        embed.setTitle(songData.title + " by " + songData.artistName)

        return message.reply(embed);
    }
}