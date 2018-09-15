/**
 * Two Factor Authentication (2FA) Flow
 * =====================
 * Flow for pin request after login
 *
 * @author:     Patryk Rzucidlo [@ptkdev] <support@ptkdev.io> (https://ptkdev.it)
 * @license:    This code and contributions have 'GNU General Public License v3'
 * @version:    0.1
 * @changelog:  0.1 initial release
 *
 */
const Manager_state = require("../common/state").Manager_state;
class Twofa extends Manager_state{
    constructor(bot, config, utils) {
        super();
        this.bot = bot;
        this.config = config;
        this.utils = utils;
        this.LOG_NAME = "twofa";
        this.Log = require("../logger/Log");
        this.log = new this.Log(this.LOG_NAME, this.config);
        this.LOG = require("../logger/types");
        this.STATE = require("../common/state").STATE;
        this.STATE_EVENTS = require("../common/state").EVENTS;
        this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK);
    }

    /**
     * Login PIN: request pin
     * =====================
     * Press submit button
     *
     */
    async requestpin() {
        this.log.warning("please insert pin in loginpin.txt, you have 50-60 seconds for that.. (tic... tac... tic... tac... tic...)");

        let button = await this.bot.$("form button");
        await button.click();
    }

    /**
     * Login PIN: Read pint
     * =====================
     * Open loginpin.txt and insert in security-code input
     *
     */
    async readpin(input) {
        this.log.info("readpin");

        const fs = require("fs");
        let data = fs.readFileSync(this.config.pin_path, "utf8");
        let pin = data.toString();

        await this.bot.waitForSelector("input#" + input);
        await this.bot.type("input#" + input, pin, { delay: 100 });
        await this.utils.screenshot(this.LOG_NAME, "readpin");
    }

    /**
     * Login PIN: Final submit
     * =====================
     * Open loginpin.txt and insert in security-code input
     *
     */
    async submitform() {
        this.log.info("submit");
        try {
            await this.bot.waitForSelector("form input#email_challenge_submit");
            let button = await this.bot.$("form input#email_challenge_submit");
            await button.click();
        } catch (err) {
            if (this.utils.is_debug()) {
                this.log.error(err);
            }
        }
    }

    /**
     * Login PIN: check errors
     * =====================
     * Check if submit not have errors
     *
     */
    async submitverify(selector) {
        let attr = "";

        try {
            attr = await this.bot.$("input#"+selector);
            if (attr != null) {
                this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.STOP_BOT);
            } else {
                this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK);
            }
        } catch (err) {
            this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK);
        }

        if (this.is_stop_bot()) {
            this.log.error("twofa: OMG! You are slow... Restart bot and retry... Idiot...");
            await this.utils.screenshot(this.LOG_NAME, "submitverify_error");
        } else if (this.is_ok()) {
            this.log.info("pin is ok");
            await this.utils.screenshot(this.LOG_NAME, "submitverify_ok");
        }

        await this.utils.sleep(this.utils.random_interval(0, 2));

        if (this.is_ok()) {
            try {
                attr = await this.bot.$("input.email-input");
                if (attr !== null) {
                    this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.STOP_BOT);
                } else {
                    this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK);
                }
            } catch (err) {
                this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.STOP_BOT);
            }

            if (this.is_stop_bot()) {
                this.log.error("twitter error... auto logout... restart bot...");
                await this.utils.screenshot(this.LOG_NAME, "submitverify_error2");
            } else if (this.is_ok()) {
                this.log.info("twitter no have a crash");
                await this.utils.screenshot(this.LOG_NAME, "submitverify_ok2");
            }
        }

        await this.utils.sleep(this.utils.random_interval(0, 2));
    }

    /**
     * 2FA Flow (check if work)
     * =====================
     *
     */
    async start_twofa_check() {
        this.log.info("twitter request pin (2fa enabled)?");

        try {
            let attr = await this.bot.$("input#challenge_response");

            if (attr !== null) {
                this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK);
            } else {
                this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.ERROR);
            }
        } catch (err) {
            this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.ERROR);
        }

        if (this.is_ok()) {
            this.log.info("yes, twitter require security pin... You can not pass!1!111! (cit.)");
            await this.utils.screenshot(this.LOG_NAME, "check_pin_request");

        } else {
            this.log.info("no, bot is at work (started)... Wait...");
            this.log.info("starting current mode");
            await this.utils.screenshot(this.LOG_NAME, "check_nopin");
        }

        await this.utils.sleep(this.utils.random_interval(0, 2));
        this.log.info("status: " + this.get_status());
    }

    /**
     * 2FA (Enabled) Flow
     * =====================
     *
     */
    async start() {
        this.log.info("twofa (enabled)", "loading...");

        this.log.warning("please insert pin in loginpin.txt, you have 50-60 seconds for that.. (tic... tac... tic... tac... tic...)");

        await this.utils.sleep(this.utils.random_interval(40, 60));

        await this.readpin("challenge_response");

        await this.submitform();

        await this.utils.sleep(this.utils.random_interval(0, 2));

        await this.submitverify("challenge_response");
        
        await this.utils.sleep(this.utils.random_interval(0, 2));
    }

}


module.exports = (bot, config, utils) => {
    return new Twofa(bot, config, utils); 
};