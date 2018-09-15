[![](https://ptkdev.it/img/bot/twitter-bot-lib.png)](https://twitter.bot.ptkdev.io)

# Twitter Bot (Library)

[![](https://img.shields.io/badge/license-GLPv3-brightgreen.svg)](#) [![](https://img.shields.io/badge/powered%20by-puppeteer-46aef7.svg)](https://github.com/GoogleChrome/puppeteer) [![](https://img.shields.io/badge/version-v0.2.3-lightgrey.svg)](https://github.com/social-manager-tools/twitter-bot.js/releases) [![](https://img.shields.io/badge/chat%20on-slack-orange.svg)](https://slack.ptkdev.io) [![](https://img.shields.io/badge/blog-medium-2AE176.svg)](http://blog.ptkdev.io) [![](https://img.shields.io/badge/twitter-ptkdevio-2AA3EF.svg)](https://twitter.com/ptkdevio) [![](https://img.shields.io/badge/help-support@ptkdev.io-fbbc05.svg)](mailto:support@ptkdev.io)

[![](https://img.shields.io/badge/donate-patreon-F87668.svg)](http://patreon.ptkdev.io) [![](https://img.shields.io/badge/donate-paypal-46AFE0.svg)](http://paypal.ptkdev.io) [![](https://img.shields.io/badge/buy%20me-coffee-4B788C.svg)](http://coffee.ptkdev.io)

[![](https://ptkdev.it/img/bot/ptkdev-twitter-bot.gif)](https://twitter.bot.ptkdev.io)

## What does it do 
This library (node module) provides api for include [twitter-bot.js](https://github.com/social-manager-tools/twitter-bot.js) function in your application. This bot helps you increase the engagement of your Twitter profile through different social algorithms. Increase the likes on your tweets and followers.

## Features
* [✓] Easy to use
* [✓] Login
* [✓] 2FA (sms pin enabled)
* [✓] Multi-Session
* [✓] Multi-Platform (Windows 10, Mac OSX, Linux, [Raspberry PI 3](https://github.com/social-manager-tools/twitter-bot.js/blob/master/INSTALL.md))
* [✓] Errors manager (bad pin, bad password)
* [✓] Screenshot and Verbose logger
* [✓] Like Mode Realistic: bot select random hashtag from config list and like fast 19-20 tweet, sleep 15-20min and repeat this all time. Sleep at night.
* [✓] Retweet Mode Realistic: bot select random hashtag from config list and rt fast 19-20 tweet, sleep 15-20min and repeat this all time. Sleep at night.
* [✘] Comment Mode Classic: select random comment and random hashtag and write comment under tweet.
* [✘] Follow/Defollow Classic: follow user from random hashtag and defollow after 1h.
* [✘] Defollow All: defollow all your following (ignore users in whitelist).

## Fast usage
1. Run `npm install twitterbotlib`
2. Get [config.js](https://raw.githubusercontent.com/social-manager-tools/twitter-bot-lib/0.2.3/config.js.tpl) file for step 3, fill it properly and remove `.tpl` suffix.
3. On your code require library, config and run bot, example:
```
    const config = require ("./config");
    const Bot = require("twitterbotlib");
    let bot = new Bot(config);
    bot.start();
```
4. If work add star :star: at this project :heart:
5. If you want help me: **[donate on paypal](http://paypal.ptkdev.io)** or become a **[backer on patreon](http://patreon.ptkdev.io)**..

For advanced configuration see [INSTALL.md](https://github.com/social-manager-tools/twitter-bot-lib/blob/master/INSTALL.md).

#### 2FA: SMS Pin
If you received sms or email pin edit `loginpin.txt` and insert it on first line. Wait 50-60 seconds...

#### Tips: hide browser
Edit `config.js` and switch `chrome_headless` option to `true`.

#### Check if work:
See images in ./logs/screenshot or disable `chrome_headless` flag.

## API 
Method | Description
------------ | -------------
start() | run twitter.bot.js

## Desktop setup (GUI Version)
1. Download [Social Manager Tools GUI](https://socialmanagertools.ptkdev.io/).
2. Run application.

## Docker setup
If you prefer to run this using Docker, an official container is available from the [Docker Hub](https://hub.docker.com/r/socialmanagertools/twitter-bot.js).

In order to run it, copy the `config.js.tpl` file, configure it as you prefer, then use it through volume mapping,
like in this example:

```sh
$ docker run \
    --restart=always \
    --name=twitter-bot \
    -d \
    -v /path/to/config.js:/app/config.js \
    socialmanagertools/twitter-bot.js &>/dev/null
```

## Roadmap
See full roadmap (open task, todo and bugs) in [project page](https://github.com/social-manager-tools/twitter-bot.js/projects?query=is%3Aopen+sort%3Aname-asc).
* [v0.1.X](https://github.com/social-manager-tools/twitter-bot.js/projects/1)
* [v0.2.X](https://github.com/social-manager-tools/twitter-bot.js/projects/2)
* [v0.3.X](https://github.com/social-manager-tools/twitter-bot.js/projects/3)

## Sorry for snake_case
I love :snake: snake_case syntax sorry for this :sob: don't hate me.

[![](https://socialmanagertools.ptkdev.io/img/socialmanagertools_logo.png)](https://github.com/social-manager-tools)

# Social Manager Tools

[Social Manager Tools GUI](https://github.com/social-manager-tools/social-manager-tools)  
[InstagramBot.js](https://github.com/social-manager-tools/instagram-bot.js) ([LIB](https://github.com/social-manager-tools/instagram-bot-lib))  
[TwitterBot.js](https://github.com/social-manager-tools/twitter-bot.js) ([LIB](https://github.com/social-manager-tools/twitter-bot-lib))  
[FacebookBot.js](https://github.com/social-manager-tools/facebook-bot.js) ([LIB](https://github.com/social-manager-tools/facebook-bot-lib))  
[WordpressTelegramBot.js](https://github.com/social-manager-tools/wordpress-telegram-bot.js) ([LIB](https://github.com/social-manager-tools/wordpress-telegram-bot-lib))  
[MediumTelegramBot.js](https://github.com/social-manager-tools/medium-telegram-bot.js) ([LIB](https://github.com/social-manager-tools/medium-telegram-bot-lib))  

# License

GNU GENERAL PUBLIC LICENSE

Copyright (c) 2018 Patryk Rzucidło (PTKDev)
