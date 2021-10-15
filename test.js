const puppeteer = require("puppeteer-core");
const GoLogin = require("gologin");
const { fillPayNewForm, openSettings } = require("./functions/pa.google.com");
const { addNewAdsAccount } = require("./functions/ads.google.com");

const path = require("path");
const fs = require("fs");

const prompt = require("prompt");
// console.log(fillPayNewForm);
// ----------------------------------------------------
(async () => {
    const card = [
        {
            number: "5534567812345678",
            date1: "11",
            date2: "25",
            cvc: "123",
            address: "some street 1",
            city: "some city",
            province: "",
            name: "cardholder name",
        },
        {
            number: "5168370830065300",
            date1: "06",
            date2: "23",
            cvc: "743",
            address: "some street 1",
            city: "some city",
            province: "",
            name: "cardholder name",
        },
        {
            number: "4895046744827133",
            date1: "04",
            date2: "23",
            cvc: "370",
            address: "some street 1",
            city: "some city",
            province: "",
            name: "cardholder name",
        },
        {
            number: "4895048807034631",
            date1: "07",
            date2: "25",
            cvc: "803",
            address: "some street 1",
            city: "some city",
            province: "",
            name: "cardholder name",
        },
        {
            number: "4895045788618663",
            date1: "10",
            date2: "26",
            cvc: "030",
            address: "some street 1",
            city: "some city",
            province: "",
            name: "cardholder name",
        },
        {
            number: "4895040082351061",
            date1: "02",
            date2: "26",
            cvc: "263",
            address: "some street 1",
            city: "some city",
            province: "",
            name: "cardholder name",
        },
        {
            number: "4895042676348230",
            date1: "05",
            date2: "26",
            cvc: "464",
            address: "some street 1",
            city: "some city",
            province: "",
            name: "cardholder name",
        },
        {
            number: "4895047455211723",
            date1: "10",
            date2: "23",
            cvc: "707",
            address: "some street 1",
            city: "some city",
            province: "",
            name: "cardholder name",
        },
        {
            number: "4895048677583154",
            date1: "04",
            date2: "25",
            cvc: "184",
            address: "some street 1",
            city: "some city",
            province: "",
            name: "cardholder name",
        },
        {
            number: "4895040411030717",
            date1: "06",
            date2: "24",
            cvc: "805",
            address: "some street 1",
            city: "some city",
            province: "",
            name: "cardholder name",
        },
        {
            number: "4895042428207221",
            date1: "02",
            date2: "26",
            cvc: "453",
            address: "some street 1",
            city: "some city",
            province: "",
            name: "cardholder name",
        },
        {
            number: "4895042176825208",
            date1: "06",
            date2: "25",
            cvc: "338",
            address: "some street 1",
            city: "some city",
            province: "",
            name: "cardholder name",
        },
        {
            number: "4895047040146103",
            date1: "03",
            date2: "26",
            cvc: "765",
            address: "some street 1",
            city: "some city",
            province: "",
            name: "cardholder name",
        },
        {
            number: "4895046554817281",
            date1: "05",
            date2: "26",
            cvc: "665",
            address: "some street 1",
            city: "some city",
            province: "",
            name: "cardholder name",
        },
        {
            number: "4895043187238787",
            date1: "07",
            date2: "25",
            cvc: "238",
            address: "some street 1",
            city: "some city",
            province: "",
            name: "cardholder name",
        },
        {
            number: "4895045802155486",
            date1: "03",
            date2: "23",
            cvc: "440",
            address: "some street 1",
            city: "some city",
            province: "",
            name: "cardholder name",
        },
    ];
    // const GL = new GoLogin({
    //     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MTVkZTc5YzI0YmM2MjJmYjBkZTY3YTEiLCJ0eXBlIjoiZGV2Iiwiand0aWQiOiI2MTVkZTdhZjA5OTZjNjIxMzUzMzgyYWEifQ.GnvoV_Z4AiDXDHkcYKEd_XQo3nMHcg0sPy_OdNzu5ug",
    //     // profile_id: 'yU0Pr0f1leiD',
    // });

    // const profiles = await GL.profiles();
    // console.log(profiles);

    const profileId = "61672ba69ebeacf3a6f2eb9e";
    const GL2 = new GoLogin({
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MTY3MmJhNjllYmVhYzQxODNmMmViOWMiLCJ0eXBlIjoiZGV2Iiwiand0aWQiOiI2MTY3MmJiNTRiYzNiNjkwNjIyYjJmMWMifQ.1RFtqZfIW2AXyHY5xpVnxFjnXwXaOWqT68SAY5bexM8",
        profile_id: profileId,
    });
    // const { status, wsUrl } = await GL2.start();

    // const cookies = [
    //     {
    //         domain: ".google.com",
    //         flag: true,
    //         path: "/ads/measurement",
    //         secure: true,
    //         expirationDate: 1646038921,
    //         name: "TAID",
    //         value: "AJHaeXKgo1cz-DfXhf8XinE01tkxhPob6BH8BD095NW7tUWDxKFD1CTunLsF6q8ohLB0YT_0eLKJPYoL03V8o_RluGKvDgIkzILLOYtgLD-yLFs495OfsS72sJXCrsrWP6ETYxo-",
    //     },
    // ].map((el) => {
    //     // el.url = `https://${el.domain}${el.path}`;
    //     return el;
    // });

    // console.log(cookies);

    // await GL2.postCookies(profiles[0].id, cookies);
    // await GL2.getRandomFingerprint({ os: "win32" });
    // await GL2.update({
    //     id: profiles[0].id,
    //     name: "profile_win",
    //     proxy: {
    //         ...profiles[0].proxy,
    //         port: 5002,
    //     },
    // });

    // const randomFingerPrint = await GL2.getRandomFingerprint({ os: "win" });
    // const { navigator, fonts, webGLMetadata, webRTC, canvas, mediaDevices, webglParams, devicePixelRatio } =
    //     randomFingerPrint;
    // const json = {
    //     id: profiles[0].id,
    //     // ...randomFingerPrint,
    //     navigator,
    //     // webGLMetadata,
    //     // browserType: "chrome",
    //     // // name: "default_name",
    //     // // notes: "auto generated",
    //     fonts: {
    //         families: fonts,
    //     },
    //     webRTC: {
    //         ...webRTC,
    //         mode: "alerted",
    //     },
    //     canvas,
    //     mediaDevices,
    //     webglParams,
    //     devicePixelRatio,
    // };
    // await GL2.update(json);

    function getDirectories(path) {
        return fs.readdirSync(path).filter(function (file) {
            return fs.statSync(path + "/" + file).isDirectory();
        });
    }

    var sessions = fs.readdirSync("./sessions/");
    console.log(sessions);
    let session = null;
    if (sessions.includes(`${profileId}.json`)) {
        session = JSON.parse(fs.readFileSync(`./sessions/${profileId}.json`, "utf8"));
    }
    if (!session) {
        session = {
            profileId,
            userEmails: {},
            blocked: false,
        };
        fs.writeFileSync(`./sessions/${profileId}.json`, JSON.stringify(session));
    }
    if (session.blocked) {
        console.log("session is blocked");
        return;
    }

    const { status, wsUrl } = await GL2.start();

    const browser = await puppeteer.connect({
        browserWSEndpoint: wsUrl.toString(),
        ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    // const result = await openSettings({ page, card: card[0] });

    // console.log("result =", result);

    // -- select account
    const isAnyEmailsInUserEmails = Object.keys(session.userEmails);
    if (!isAnyEmailsInUserEmails.length) {
        await page.goto("https://accounts.google.com/SignOutOptions?hl=en", { waitUntil: "networkidle2" });
        await page.waitForTimeout(2000);
        const accountItems = await page.$$("li[id]");
        console.log(session);
        accountItems.forEach(async (el) => {
            const emailEl = await el.$("span.account-email");
            const email = await emailEl.evaluate((el) => el.innerText);
            console.log(session, email);

            if (!session.userEmails[email]) {
                session.userEmails[email] = {
                    profileId: profileId,

                    email: email,
                    isSingout: false,
                    inWork: false,
                    isUsed: false,
                    steps: [],
                    wasFirstLaunch: false,
                    adsAccounts: {},
                };
            }

            // https://myaccount.google.com/?utm_source=sign_in_no_continue&pli=1
            await emailEl.click();
            await page.waitForTimeout(4000);
            const url = await page.url();
            if (!url.includes("myaccount.google.com")) {
                session.userEmails[email].isSingout = true;
            }
            fs.writeFileSync(`./sessions/${profileId}.json`, JSON.stringify(session));
            await page.goto("https://accounts.google.com/SignOutOptions?hl=en", { waitUntil: "networkidle2" });
            await page.waitForTimeout(2000);
        });
    }

    // return;

    let cardsAttempt = 111;
    while (cardsAttempt < 10) {
        cardsAttempt++;
        const result2 = await openSettings({ page, card: card[cardsAttempt] });
        console.log(result2);
        if (result2.ok) {
            break;
        }
    }

    // await fillPayNewForm({ page, card });

    console.log("second:", session);

    for (let gmAccIter in session.userEmails) {
        const gmailAccount = session.userEmails[gmAccIter];
        if (gmailAccount.isSingout) continue;
        if (gmailAccount.isUsed) continue;
        await addNewAdsAccount({ page, offer: null, gmailAccount, session });
    }

    return;

    // console.log(await page.content());
    // await browser.close();
    // await GL.stop();
    // await GL2.stop();
})();
