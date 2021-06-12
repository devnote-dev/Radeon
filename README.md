<h1><img src="https://cdn.discordapp.com/avatars/762359941121048616/5095536e2741937b837d40ac369a4a7b.png" width=32 height=32 align="center"> Radeon Development</h1></img>

Radeon is a multi-functional moderation bot with an anti-raid system! While still a small bot, it has a powerful and up-to-date moderation system with active development on the anti-raid system. Any and all support is appreciated!

## Contributions
If you want to contribute via suggestions, join Radeon's [**Support Server**](https://discord.gg/xcZwGhSy4G) to make one there or open an issue named "suggestion: \<name-here>" in this Github (without the `<>`).

Contributions via pull-requests should be made to the **dev** or **updates** branch, not the main branch. This is so that we can test the code first before pushing, and makes reverting files easier. :)

## Self-Hosting
We **do not** currently support self-hsoted instances. Please do not contact a maintainer requesting support for it.

**Config File Format:**
```json
{
    "prefix":"PREFIX",
    "token":"BOT_TOKEN_HERE",
    "botOwners":[
        "OWNER_IDS"
    ],
    "botAdmins":[
        "ADMIN_IDS"
    ],
    "logs":{
        "event":"EVENT_CHANNEL_ID",
        "error":"ERROR_CHANNEL_ID",
        "joins":"BOT_JOINS_CHANNEL_ID",
        "guilds":"GUILDS_STATS_CHANNEL_ID",
        "users":"USERS_STATS_CHANNEL_ID"
    },
    "MongoPath":"MONGODB_PASSWORD_KEY",
    "YoutubeKey":"YOUTUBEv3_API_KEY"
}
```

## Maintainers
* Devnote-dev - Owner
* tryharddeveloper - Owner
* Crenshaw - Contributor
* SpeckyYT - Contributor

This repository is licensed under the GNU GPL v3 License.

© Radeon Development