/**
 * Login Flow
 * =====================
 * Open browser, set user/pass and try login
 *
 * @author:     Patryk Rzucidlo [@ptkdev] <support@ptkdev.io> (https://ptkdev.it)
 * @license:    This code and contributions have 'GNU General Public License v3'
 * @version:    0.1
 * @changelog:  0.1 initial release
 *
 */
const Manager_state = require("../common/state").Manager_state;
const jsonfile = require("jsonfile");
class Login extends Manager_state {
    constructor(bot, config, utils) {
        super();
        this.bot = bot;
        this.config = config;
        this.utils = utils;
        this.LOG_NAME = "login";
        this.STATE = require("../common/state").STATE;
        this.STATE_EVENTS = require("../common/state").EVENTS;
        this.Log = require("../logger/Log");
        this.log = new this.Log(this.LOG_NAME, this.config);
        this.session = null;
        this.sessionFilePath = "session.json";
    }

    /**
     * Trying read file with session
     */
    async read_session_file() {
        jsonfile.readFile(this.sessionFilePath, (err, data) => {  
            if (err || data.length === 0) {
                this.log.info("Cant restore session.");
            }

            this.session = data;
        });
    }

    /**
     * Check for existing session
     */
    session_exists() {
        return this.session;
    }

    /**
     * Restore session
     */
    async restore_session() {
        if (this.session.length !== 0) {
            for (let cookie of this.session) {
                await this.bot.setCookie(cookie);
            }

            return true;
        }
        this.log.error("Can't restore session. Session is empty.");
    }

    /**
     * Open login page
     * =====================
     * Browser start
     *
     */
    async open_loginpage() {
        this.log.info("open_loginpage");

        await this.bot.goto("https://twitter.com/login/");
    }

    /**
     * Compile input
     * =====================
     * Set username
     *
     */
    async set_username() {
        this.log.info("set_username");
        await this.bot.waitForSelector("input.email-input");
        await this.bot.type("input.email-input", this.config.twitter_username, { delay: 100 });
    }

    /**
     * Compile input
     * =====================
     * Set password
     *
     */
    async set_password() {
        this.log.info("set_password");
        await this.bot.waitForSelector("input.js-password-field");
        await this.bot.type("input.js-password-field", this.config.twitter_password, { delay: 100 });
    }

    /**
     * Login
     * =====================
     * Press submit button
     *
     */
    async submitform() {
        this.log.info("submit");
        await this.bot.waitForSelector("form button");
        let button = await this.bot.$("form button");
        await button.click();

        await this.utils.screenshot(this.LOG_NAME, "submit");
    }

    /**
     * Login check errors
     * =====================
     * Bad password or similar
     *
     */
    async submitverify() {
        this.log.info("checkerrors");

        let text = "", text_msg = "";

        try {
            text = await this.bot.$("#message-drawer");
            text_msg = await this.bot.$(".message-text");
            if (text !== null && text_msg.trim() != "") {
                this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.ERROR);
            } else {
                this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK);
            }
        } catch (err) {
            this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK);
        }

        if (this.is_error()) {
            let html_response = await this.bot.evaluate(body => body.innerHTML, text_msg);
            await text_msg.dispose();

            this.log.error("Error: " + html_response + " (restart bot and retry...)");
            await this.utils.screenshot(this.LOG_NAME, "checkerrors_error");
        } else {
            this.log.info("password is correct");
            
            await this.utils.screenshot(this.LOG_NAME, "checkerrors");

            await this.utils.sleep(this.utils.random_interval(4, 8));

            const cookiesObject = await this.bot.cookies();

            jsonfile.writeFile(this.sessionFilePath, cookiesObject, { spaces: 2 }, (err) => {
                if (err) {
                    this.log.info("The file could not be written.", err);
                    this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.ERROR);
                }
                this.log.info("Session has been successfully saved");
                this.emit(this.STATE_EVENTS.CHANGE_STATUS, this.STATE.OK);
            });
        }

        await this.utils.sleep(this.utils.random_interval(4, 8));
    }

    /**
     * Login Flow
     * =====================
     *
     */
    async start() {
        this.log.info("loading...");

        this.log.info("checking for session to restore...");

        this.log.info("exist: ", this.session_exists());

        await this.read_session_file();

        await this.utils.sleep(this.utils.random_interval(4, 8));

        if (this.session_exists()) {
            this.log.info("restoring session...");

            await this.restore_session();

            this.log.info("Session restored correctly.");
        } else {
            await this.open_loginpage();

            await this.utils.sleep(this.utils.random_interval(4, 8));

            await this.set_username();

            await this.utils.sleep(this.utils.random_interval(4, 8));

            await this.set_password();

            await this.utils.sleep(this.utils.random_interval(4, 8));

            await this.submitform();
        }

        await this.utils.sleep(this.utils.random_interval(4, 8));

        await this.submitverify();

        this.log.info("login_status is " + this.get_status());

        await this.utils.sleep(this.utils.random_interval(4, 8));
    }
}

module.exports = (bot, config, utils) => {
    return new Login(bot, config, utils); 
};