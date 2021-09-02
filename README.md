# What is this?

Have your users verify with a captcha using Discord Buttons.

# Installation

`npm i djs.captcha`


```
const Captcha = require('djs.captcha')

const captcha = new Captcha(client, {
    roleID: 'Role ID Here',
    channelID: 'Text Channel ID Here',
    removeRoleID: 'The role removed from users once verified'
});
```

# Examples
```
const Discord = require("discord.js");
const client = new Discord.Client();
const Captcha = require('djs.captcha')

const captcha = new Captcha(client, {
    roleID: 'Role ID Here',
    channelID: 'Text Channel ID Here',
    removeRoleID: 'The role removed from users once verified'
});

client.login("token")
```

# Events

You can see when a user has failed or completed a captcha whith these events

```
Captcha.on('success', (info) => {
  console.log(info);
});

Captcha.on('failure', (info) => {
  console.log(info);
});
```

# Github
https://github.com/strange-glitch/djs.captcha

# Discord Server
<img src="https://discordapp.com/api/guilds/882743055516569610/widget.png?style=banner2"/>
