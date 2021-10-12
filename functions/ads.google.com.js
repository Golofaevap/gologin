async function addNewAdsAccount({ page, offer }) {
    await page.goto("https://ads.google.com/nav/selectaccount?hl=en", { waitUntil: "networkidle2" });

    // await clickAddNewAccountButton({ page });

    await page.goto(
        "https://ads.google.com/aw/billing/signup?ocid=791879196&euid=561093261&__u=1494783589&uscid=791879196&__c=7612217404&authuser=0&hl=enhl%3Den&__e=7242097331&subid=de-de-et-g-aw-c-home-awhp_xin1_signin!o2",
        { waitUntil: "networkidle2" }
    );
    await setupBilling({ page });
}
async function setupBilling({ page }) {
    const currUrl = await page.url();
    await page.goto("https://ads.google.com/aw/billing/signup?hl=en&" + currUrl.split("?")[1]);
    await page.waitForTimeout(15000);

    const frameHandle = await page.$$("iframe");
    console.log("frameHandle.length", frameHandle.length);
    const iFrame = await frameHandle[frameHandle.length - 1].contentFrame();
    // console.log(frameHandle.length - 1, iFrame);
    // const frameDiv = await iFrame.$$("div");
    // console.log(frameDiv.length);

    // for (let i of frameDiv) {
    //     const element = await i.evaluate((el) => {
    //         if (el.innerText.includes("agree") && el.innerText.includes("conditions")) {
    //             return el.innerText;
    //         }
    //     });
    //     try {
    //         if (element) await i.click();
    //         break;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    await page.waitForTimeout(1500);
    // const checkBoxs = await iFrame.$$('div[class*="b3-checkbox-check-container"]');
    const precheckBox = await iFrame.$('div[class*="b3-legal-message-explicit-document"]');
    // console.log(await precheckBox.getProperty(innerText));
    await precheckBox.click();
    // return;
    await page.waitForTimeout(1500);

    const saveButton = await page.$('material-button[class*="saveButton"]');
    await saveButton.click();
}

async function clickAddNewAccountButton({ page }) {
    await page.waitForTimeout(2000);

    const attemptsAccounts = {};
    while (true) {
        const accountsExist = await page.$$("material-list-item");
        let accountToSetup = null;
        for (let exAcc of accountsExist) {
            const getIdSelegtor = await exAcc.$("span");
            const isSetupInProgress = await exAcc.evaluate(
                (el) => el.innerText.includes("etup") && el.innerText.includes("progress")
            );
            if (!isSetupInProgress) continue;
            const getId = await getIdSelegtor.evaluate((el) => el.innerText);
            if (!(getId in attemptsAccounts)) {
                attemptsAccounts[getId] = 1;
            }
            if (attemptsAccounts[getId] < 5) {
                attemptsAccounts[getId]++;
                accountToSetup = exAcc;
            }
        }
        if (!accountToSetup) {
            const buttonToAddAccount = await page.waitForSelector('material-button[class*="new-account-button"]');
            await buttonToAddAccount.click();

            await page.waitForTimeout(10000);

            await page.goto("https://ads.google.com/nav/selectaccount?hl=en", { waitUntil: "networkidle2" });
        } else {
            await accountToSetup.click();
            break;
        }

        const waitForUrl = page.url();
        if (!waitForUrl.includes("nav/selectaccount")) break;
        await page.waitForTimeout(2000);
    }

    await page.waitForTimeout(5000);
    const urlToOpenExpertMode = await page.url();
    await page.goto("https://ads.google.com/aw/campaigns/new?" + urlToOpenExpertMode.split("?")[1]);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(1000);

    // span signup-escape _ngcontent-awn-CM_EDITING-4
    await page.waitForTimeout(5000);
    await page.goto("https://ads.google.com/aw/signup/expert?hl=en&" + urlToOpenExpertMode.split("?")[1]);
    await page.waitForTimeout(5000);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(1000);

    await selectCountryOnRegistration({ page });
    await page.waitForTimeout(3000);
    await selectCurrencyOnRegistration({ page });
    // material-dropdown-select
    await radioButtonOnRegistration({ page });
    await submitOnRegistration({ page });
}
async function radioButtonOnRegistration({ page }) {
    try {
        const radioButton = await page.$$("material-radio");
        await radioButton[Math.floor(Math.random(radioButton.length))].click();
    } catch (error) {
        console.log(error);
    }
}

async function submitOnRegistration({ page }) {
    await page.waitForTimeout(3000);

    const submitButton = await page.$('material-button[class*="account-activation-button"]');
    await submitButton.click();

    await page.waitForTimeout(13000);
}

async function selectCurrencyOnRegistration({ page }) {
    await page.keyboard.press("Escape");
    await page.waitForTimeout(1000);

    const currencyDropDown = await page.waitForSelector("allowed-currency-picker");
    await currencyDropDown.click();
    await page.waitForTimeout(2000);

    const currencyItem = await page.$$("material-select-dropdown-item");
    for (let currency of currencyItem) {
        let shouldClick = await currency.evaluate((el) => {
            return el.innerText && el.innerText.includes("PHP");
        });
        if (shouldClick) {
            await currency.click();
            await page.waitForTimeout(2000);

            break;
        }
    }
}
async function selectCountryOnRegistration({ page }) {
    for (let i = 0; i < 5; i++) {
        try {
            await page.waitForTimeout(5000);
            await page.keyboard.press("Escape");
            await page.waitForTimeout(1000);
            const countryDropDown = await page.waitForSelector("country-select");
            await countryDropDown.click();
            await page.waitForTimeout(2000);
            break;
        } catch (error) {
            await page.goto("https://ads.google.com/aw/signup/expert?hl=en&" + urlToOpenExpertMode.split("?")[1]);
            await page.waitForTimeout(5000);
            console.log(error);
        }
    }

    const countryItem = await page.$$("material-select-dropdown-item");
    for (let country of countryItem) {
        let shouldClick = await country.evaluate((el) => {
            // console.log(el.innerText, el.innerText.toLowerCase().includes("philippines"));
            return el.innerText && el.innerText.toLowerCase().includes("philippines");
        });
        // console.log(shouldClick);
        if (shouldClick) {
            await page.waitForTimeout(2000);
            await country.click();
            await page.waitForTimeout(2000);
            break;
        }
    }
}

module.exports = {
    addNewAdsAccount,
};
