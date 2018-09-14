/**
 * MODE: rtmode_realistic
 * =====================
 * Select random hashtag from config list, retweet fast 10-12 tweet and sleep 15-20min. Sleep at night | 400-600 rt/day.
 *
 * @author:     Patryk Rzucidlo [@ptkdev] <support@ptkdev.io> (https://ptkdev.it)
 * @license:    This code and contributions have 'GNU General Public License v3'
 * @version:    0.1
 * @changelog:  0.1 initial release
 * 
 */
const Manager_state = require("../common/state").Manager_state;
class Retweetmode_realistic extends Manager_state {
    constructor(bot, config, utils) {
        super();
        this.bot = bot;
        this.config = config;
        this.utils = utils;
        this.cache_hash_tags = [];
        this.tweet_retweeted = [];
        this.tweet_current = "";
        this.LOG_NAME = "rt_realistic";
        this.STATE = require("../common/state").STATE;
        this.STATE_EVENTS = require("../common/state").EVENTS;
        this.Log = require("../logger/Log");
        this.log = new this.Log(this.LOG_NAME, this.config);
    }

    /**
     * Get tweet url from cache
     * @return {string} url
     */
    get_tweet_url() {
        let tweet_url = "";
        do {
            tweet_url = this.cache_hash_tags.pop();
        } while ((typeof tweet_url === "undefined") && this.cache_hash_tags.length > 0);
        return tweet_url;
    }

    /**
     * rtmode_realistic: Open Hashtag
     * =====================
     * Get random hashtag from array and open page
     *
     */
    async open_hashtagpage() {
        let hashtag_tag = this.utils.get_random_hash_tag();
        this.log.info(`current hashtag ${hashtag_tag}`);
        try {
            hashtag_tag = hashtag_tag.replace("#", "%23");
            await this.bot.goto("https://twitter.com/search?f=tweets&vertical=default&q=" + hashtag_tag + "&src=typd&l="+this.config.twitter_language);
        } catch (err) {
            this.log.error(`goto ${err}`);
        }

        await this.utils.sleep(this.utils.random_interval(4, 8));

        await this.utils.screenshot(this.LOG_NAME, "last_hashtag");
    }

    /**
     * rtmode_realistic: Open Photo
     * =====================
     * Open url of tweet and cache urls from hashtag page in array
     *
     */
    async get_urltweets() {
        this.log.info("get_urltweets");

        let tweet_url = "";

        if (this.cache_hash_tags.length <= 0) {
            try {
                this.cache_hash_tags = await this.bot.$$eval(".stream a.tweet-timestamp", hrefs => hrefs.map((a) => {
                    return a.href;
                }));

                await this.utils.sleep(this.utils.random_interval(10, 15));

                if (this.utils.is_debug())
                    this.log.debug(`array tweets ${this.cache_hash_tags}`);

                tweet_url = this.get_tweet_url();

                this.log.info(`current tweet url ${tweet_url}`);
                if (typeof tweet_url === "undefined")
                    this.log.warning("check if current hashtag have tweets, you write it good in config.js? Bot go to next hashtag.");

                await this.utils.sleep(this.utils.random_interval(4, 8));

                await this.bot.goto(tweet_url);
            } catch (err) {
                this.cache_hash_tags = [];
                this.log.error(`get_urltweets error ${err}`);
                await this.utils.screenshot(this.LOG_NAME, "get_urltweets_error");
            }
        } else {
            tweet_url = this.get_tweet_url();

            this.log.info(`current tweet url from cache ${tweet_url}`);
            await this.utils.sleep(this.utils.random_interval(4, 8));

            try {
                await this.bot.goto(tweet_url);
            } catch (err) {
                this.log.error(`goto ${err}`);
            }
        }

        this.tweet_current = tweet_url;
        if (typeof tweet_url !== "undefined"){
            if(typeof this.tweet_retweeted[this.tweet_current] === "undefined"){
                this.tweet_retweeted[this.tweet_current] = 1;
            }else{
                this.tweet_retweeted[this.tweet_current]++;
            }
            
        }
        await this.utils.sleep(this.utils.random_interval(4, 8));
    }

    /**
     * rtmode_realistic: Love me
     * =====================
     * Click on heart and verify if twitter not (soft) ban you
     *
     */
    async rt_click_heart() {
        this.log.info("try rt");

        try {
            if(this.tweet_retweeted[this.tweet_current] > 1){
                this.log.warning("NOT RT, retweeted previously");
            }else{
                await this.bot.waitForSelector(".permalink-tweet-container button.js-actionRetweet");
                let button = await this.bot.$(".permalink-tweet-container button.js-actionRetweet");
                await button.click();
                await this.utils.sleep(this.utils.random_interval(2, 3));
                
                await this.bot.waitForSelector("button.retweet-action");
                let buttonbig = await this.bot.$("button.retweet-action");
                await buttonbig.click();
                this.log.info("RT");
            }

            this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK);
        } catch (err) {
            if (this.utils.is_debug())
                this.log.debug(err);

            this.log.warning(":(");
            this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.ERROR);
        }

        await this.utils.sleep(this.utils.random_interval(4, 8));

        await this.utils.screenshot(this.LOG_NAME, "last_rt_after");
    }

    /**
     * RetweetmodeClassic Flow
     * =====================
     *
     */
    async start() {
        this.log.info("rt_realistic");

        let today = "";

        do {
            today = new Date();
            this.log.info("time night: " + (parseInt(today.getHours() + "" + (today.getMinutes() < 10 ? "0" : "") + today.getMinutes())));
            
            if(this.config.bot_sleep_night === false){
                this.config.bot_stop_sleep = "00:00";
            }
            if ((parseInt(today.getHours() + "" + (today.getMinutes() < 10 ? "0" : "") + today.getMinutes()) >= (this.config.bot_stop_sleep).replace(":", ""))) {

                this.log.info("loading... " + new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds()));
                this.log.info("cache array size " + this.cache_hash_tags.length);

                if (this.cache_hash_tags.length <= 0)
                    await this.open_hashtagpage();

                await this.utils.sleep(this.utils.random_interval(4, 8));

                await this.get_urltweets();

                await this.utils.sleep(this.utils.random_interval(4, 8));

                await this.rt_click_heart();

                if (this.cache_hash_tags.length <= 0 && this.is_not_ready()) {
                    this.log.info("finish fast rt, bot sleep " + this.config.bot_fastrt_min + "-" + this.config.bot_fastrt_max + " minutes");
                    this.cache_hash_tags = [];
                    await this.utils.sleep(this.utils.random_interval(60 * this.config.bot_fastrt_min, 60 * this.config.bot_fastrt_max));
                }
            } else {
                this.log.info("is night, bot sleep");
                await this.utils.sleep(this.utils.random_interval(60 * 4, 60 * 5));
            }
        } while (true);
    }

}

module.exports = (bot, config, utils) => { return new Retweetmode_realistic(bot, config, utils); };