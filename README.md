<p align="center"><img src="https://cdn.discordapp.com/avatars/762359941121048616/5095536e2741937b837d40ac369a4a7b.png"></p>
<h1 align="center">Radeon Development</h1>

Radeon is a multi-functional moderation bot with an anti-raid system! While still a small bot, it has a powerful and up-to-date moderation system with active development on the anti-raid system. Any and all support is appreciated!

## Contributing
If you want to contribute via suggestions, join Radeon's [**support server**](https://discord.com/invite/xcZwGhSy4G) to make one there or open an issue named "suggestion: \<name-here>" in this Github (without the `<>`).

Contributions via pull-requests should be made to the **dev** branch, not the main branch. This is so that we can test the code first before pushing, and makes reverting files easier. :)

## Self-Hosting
We **do not** currently support self-hosted instances. Please do not contact a maintainer requesting support for it. If you have experience and want to self-host, you are free to do so.

**Config File Format:**
```json
{
    "token":"BOT_TOKEN",
    "owners":[
        "OWNER_IDS",
        "..."
    ],
    "admins":[
        "ADMIN_IDS",
        "..."
    ],
    "logs":{
        "shards":"SHARD_EVENTS_CHANNEL_ID",
        "joins":"JOIN_LEAVE_CHANNEL_ID",
        "errors":"ERROR_LOGS_CHANNEL_ID",
        "global":"GLOBAL_EVENTS_CHANNEL_ID",    
    },
    "mongo_path":"MONGO_DB_SRV"
}
```

## Maintainers
* [devnote-dev](https://github.com/devnote-dev) - Owner
* [tryharddeveloper](https://github.com/tryharddeveloper) - Owner
* [Crenshaw](https://github.com/Crenshaw1312) - Contributor
* [SpeckyYT](https://github.com/SpeckyYT) - Contributor
* [Cipherizer](https://github.com/Cipherizer) - Contributor

This repository is licensed under the GNU AGPL v3 License.

© 2021-2022 Radeon Development
