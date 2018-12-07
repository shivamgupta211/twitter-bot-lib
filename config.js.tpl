module.exports = {
    // TwitterBot.js Configs
    "debug": true,
    "login": true,
    "ui": false, // only for social-manager-tools

    // Twitter Account
    "twitter_username": "ptkdev", // without @
    "twitter_password": "password",
    "twitter_hashtag": ["#muraleshunter", "#like4like", "follow4follow", "hello"], // use # prefix if you want hashtag, remove prefix if you want words
    "twitter_language": "en", // available: en, it, de, pl, uk, us, ru and more...
    "twitter_pin": "sms", // method to receive pin (only sms available)

    // BOT Configs
    // [WORK] likemode_realistic        - select random hashtag from config list, like fast 10-12 tweet and sleep 15-20min. Sleep at night
    // [WORK] rtmode_realistic          - select random hashtag from config list, retweet fast 10-12 tweet and sleep 15-20min. Sleep at night
    "bot_mode": "likemode_realistic",
    "bot_likeday_min": 800,      // min like and rt daily
    "bot_likeday_max": 900,      // max like and rt daily. In 2018 limit twitter is 1000/day
    "bot_sleep_night": true,     // if you need stop bot in night 
    "bot_stop_sleep": "7:00",    // sleep from 00:00 to 7:00 am, work in likemode_realistic and rtmode_realistic

    // Puppeteer Configs
    "chrome_headless": false,
    "chrome_options": ["--disable-gpu", "--no-sandbox", "--window-size=1920x1080"],
    "executable_path": "", // example for Mac OS: /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome
    "user_agent": "", // set Puppeteers user agent

    // LOG
    "pin_path":"./node_modules/twitterbotlib/loginpin.txt",
    "log_path":"./node_modules/twitterbotlib/logs/debug.log",
    "logerr_path":"./node_modules/twitterbotlib/logs/errors.log",
    "screenshot_path":"./node_modules/twitterbotlib/logs/screenshot/",
    "log": {
        "drivers": ["console"], // slack or console
        "screenshot": false,  // disable or enable screenshot in logs folder
        "channels": {
            "console": "",
            "slack": {
                "webhook": ""
            }
        }
    }
};
