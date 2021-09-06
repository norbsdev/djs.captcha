#  djs.captcha 
  <p>
    <a href="https://www.npmjs.com/package/djs.captcha"><img src="https://img.shields.io/npm/v/djs.captcha?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/djs.captcha"><img src="https://img.shields.io/npm/dt/djs.captcha?maxAge=3600" alt="NPM downloads" /></a>
    <a href="https://www.npmjs.com/package/djs.captcha"><img src="https://img.shields.io/snyk/vulnerabilities/npm/djs.captcha?color=success&label=package%20vulnerabilities&logo=snyk&logoColor=red?maxAge=3600" alt="djs.captcha" /></a>

  </p>
  <p>
    <a href="https://www.npmjs.com/package/djs.captcha"><img src="https://nodei.co/npm/djs.captcha.png?downloads=true&stars=true" alt="NPM Banner"></a>
  </p>

# What is this?

Have your users verify with a captcha using Discord Buttons on server join.

# Installation

`npm i djs.captcha`


```
const Captcha = require('djs.captcha')

const captcha = new Captcha(client, {
    roleID: 'Role ID Here',
    channelID: 'Text Channel ID Here',
    onFail: 'kick or ban'
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
    onFail: 'kick or ban'
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
