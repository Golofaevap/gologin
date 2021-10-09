const puppeteer = require("puppeteer-core");
const GoLogin = require("gologin");

(async () => {
    const card = {
        number: "1234567812345678",
        date1: "11",
        date2: "25",
        cvc: "123",
        address: "some street 1",
        city: "some city",
        province: "",
    };
    // const GL = new GoLogin({
    //     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MTVkZTc5YzI0YmM2MjJmYjBkZTY3YTEiLCJ0eXBlIjoiZGV2Iiwiand0aWQiOiI2MTVkZTdhZjA5OTZjNjIxMzUzMzgyYWEifQ.GnvoV_Z4AiDXDHkcYKEd_XQo3nMHcg0sPy_OdNzu5ug",
    //     // profile_id: 'yU0Pr0f1leiD',
    // });

    // const profiles = await GL.profiles();
    // console.log(profiles);
    const GL2 = new GoLogin({
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MTVkZTc5YzI0YmM2MjJmYjBkZTY3YTEiLCJ0eXBlIjoiZGV2Iiwiand0aWQiOiI2MTVkZTdhZjA5OTZjNjIxMzUzMzgyYWEifQ.GnvoV_Z4AiDXDHkcYKEd_XQo3nMHcg0sPy_OdNzu5ug",
        profile_id: "616080c4a25b591d57a39d02",
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

    const { status, wsUrl } = await GL2.start();

    const browser = await puppeteer.connect({
        browserWSEndpoint: wsUrl.toString(),
        ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.goto("https://pay.google.com/?hl=en");

    await page.waitForSelector("button");
    const payUrl = (await page.url()) + "&hl=en";
    console.log(payUrl);
    await page.goto(payUrl);

    await page.waitForSelector("button");
    await page.waitForTimeout(2000);
    const buttons = await page.$$("button");
    console.log(buttons.length);
    for (let btn of buttons) {
        const shouldClick = await btn.evaluate((el) => el.innerText.toLowerCase().includes("add"));
        console.log(shouldClick);
        shouldClick && (await btn.click());
    }
    await page.waitForTimeout(2000);

    const frameHandle = await page.waitForSelector("iframe");
    const iFrame = await frameHandle.contentFrame();

    // const iFrame = page.frames().find((el) => true);
    // console.log(iFrame);
    // await iFrame.evaluate((el) => console.log(el.innerText));
    const regionSelector = await iFrame.$('div[class="b3-collapsing-form-placeholder-text"]');
    await regionSelector.click();

    await page.waitForTimeout(2000);
    const countrySelectorOpent = await iFrame.$('span[class*="countryselector-flag"]');
    await countrySelectorOpent.click();
    await page.waitForTimeout(2000);

    const philippines = await iFrame.$('div[class="goog-menuitem"][data-value="PH"]');
    await philippines.click();

    await page.waitForTimeout(2000);
    await iFrame.waitForSelector('div[class="b3-collapsing-form-placeholder-text"]');

    const userName = await iFrame.$('input[name="ccname"]');
    await userName.click({ clickCount: 3 });
    await userName.type("changed name", { delay: 200 });

    const regionSelector2 = await iFrame.$('div[class="b3-collapsing-form-placeholder-text"]');
    await regionSelector2.click();

    await page.waitForTimeout(2000);
    const addressLine1 = await iFrame.$('input[name="ADDRESS_LINE_1"]');
    await addressLine1.type(card.address, { delay: 200 });

    await page.waitForTimeout(2000);
    const cityName = await iFrame.$('input[name="LOCALITY"]');
    await cityName.type(card.city, { delay: 200 });

    await page.waitForTimeout(2000);
    const adminArea = await iFrame.$('div[data-name="ADMIN_AREA"]');
    await adminArea.click();

    await page.waitForTimeout(2000);
    const areas = await iFrame.$$('div[class="goog-menuitem"][role="menuitem"][data-value]');
    while (true) {
        try {
            await areas[Math.floor(Math.random() * areas.length)].click();
            break;
        } catch (error) {
            console.log(error);
        }
    }

    await page.waitForTimeout(2000);
    const cardnumber = await iFrame.$('input[name="cardnumber"]');
    await cardnumber.type(card.number, { delay: 200 });

    await page.waitForTimeout(2000);
    const ccmonth = await iFrame.$('input[name="ccmonth"]');
    await ccmonth.type(card.date1, { delay: 200 });

    await page.waitForTimeout(2000);
    const ccyear = await iFrame.$('input[name="ccyear"]');
    await ccyear.type(card.date2, { delay: 200 });

    await page.waitForTimeout(2000);
    const cvc = await iFrame.$('input[name="cvc"]');
    await cvc.type(card.cvc, { delay: 200 });

    // console.log(await page.content());
    // await browser.close();
    // await GL.stop();
    // await GL2.stop();
})();
