const prompt = require("syncprompt");
const fs = require("fs");
const { jsCopy, gotoWithEmail } = require("../utils");
// const prompt = require("prompt");
// ================================================================================
// ================================================================================
async function addNewAdsAccount2({ page, offer, emailToWorkWith, session }) {
    throw "huynya";
}

// ================================================================================
// ================================================================================
async function selectAdsAccountToWorkWith({ page, offer, emailToWorkWith, session }) {
    const runExistingAccount = [];
    while (true) {
        for (const iAA in emailToWorkWith.adsAccounts) {
            const adsAccount = emailToWorkWith.adsAccounts[iAA];
            if (adsAccount.wasInAccount) continue;
            if (adsAccount.accountExpertModeCreated) continue;
            if (adsAccount.completed) continue;
            if (adsAccount.suspended) continue;
            if (adsAccount.blocked) continue;
            if (adsAccount.inWork) continue;

            // console.log("       ---    account to work with", iAA);
            adsAccount.id = iAA;
            runExistingAccount.push(adsAccount);
        }
        if (runExistingAccount.length) {
            const selectedAccount = runExistingAccount[Math.floor(Math.random() * runExistingAccount.length)];
            // adsId: accountId.trim(),
            session.current.ads = selectedAccount.adsId;
            return { ok: true };
        } else {
            const result = await addNewAccountButtonClick({ page, offer, emailToWorkWith, session });
            if (!result.ok) {
                // Здесь хорощо бы проверять причину ошибки и либо пытаться снова - дибо блочить весь рекламный кабинет
                // либо блочить весь аккаунт гугла (gmail)
                throw "unnable to create new accout";
            }
        }
    }
}
// ================================================================================
// ================================================================================
async function addNewAccountButtonClick({ page, offer, emailToWorkWith, session }) {
    const buttonToAddAccount = await page.waitForSelector('material-button[class*="new-account-button"]');
    await buttonToAddAccount.click();

    await page.waitForTimeout(10000);

    const accountIdEl = await page.$("div[title]");
    const accountId = await accountIdEl.evaluate((el) => el.getAttribute("title"));
    // const urlOfNewAccount = console.log(accountId);
    emailToWorkWith.adsAccounts[accountId.trim()] = {
        adsId: accountId.trim(),
        accountExpertModeCreated: false,
        billingSetup: false,
        scriptAdded: false,
        scriptLaunched: false,
        wasInAccount: false,
        suspended: false,
        blocked: false,
        completed: false,
        inWork: false,
        tail: null,
    };
    fs.writeFileSync(`./sessions/${session.profileId}.json`, JSON.stringify(session));

    await page.goto("https://ads.google.com/nav/selectaccount?hl=en", { waitUntil: "networkidle2" });
    return { ok: true, message: "Account was created" };
}
// ================================================================================
// ================================================================================

async function addNewAdsAccount() {
    // await gotowith
    await gotoWithEmail({ page, emailToWorkWith, url: "https://ads.google.com/nav/selectaccount?hl=en" });

    // await page.goto("https://ads.google.com/nav/selectaccount?hl=en", { waitUntil: "networkidle2" });
    await page.waitForTimeout(3000);
    emailToWorkWith.inWork = true;
    if (!emailToWorkWith.wasFirstLaunch) {
        console.log("Collecting old accounts .... ");
        const accountsExist = await page.$$('material-list-item[class*="user-customer-list-item"]');
        console.log("accountsExist: ", accountsExist.length, emailToWorkWith.email);
        for (let el of accountsExist) {
            const oldAccountsEl = await el.$('span[class*="material-list-item-secondary"]');
            const adsAccountId = await oldAccountsEl.evaluate((el2) => el2.innerText);
            if (!emailToWorkWith.adsAccounts[adsAccountId.trim()]) {
                emailToWorkWith.adsAccounts[adsAccountId.trim()] = {
                    wasInAccount: true,
                };
                console.log("adsAccountId .... ");

                fs.writeFileSync(`./sessions/${session.profileId}.json`, JSON.stringify(session));
            }

            //
        }

        emailToWorkWith.wasFirstLaunch = true;
        fs.writeFileSync(`./sessions/${session.profileId}.json`, JSON.stringify(session));
    }
    const runExistingAccount = [];
    for (const iAA in emailToWorkWith.adsAccounts) {
        const adsAccount = emailToWorkWith.adsAccounts[iAA];
        if (adsAccount.wasInAccount) continue;
        if (adsAccount.accountExpertModeCreated) continue;
        if (adsAccount.completed) continue;
        if (adsAccount.suspended) continue;
        if (adsAccount.blocked) continue;
        if (adsAccount.inWork) continue;

        // console.log("       ---    account to work with", iAA);
        adsAccount.id = iAA;
        runExistingAccount.push(adsAccount);
    }
    if (!runExistingAccount.length) {
        return await clickAddNewAccountButton({ page, emailToWorkWith, session });
    } else {
    }
    return { ok: true, message: "account selected" };
}
// ================================================================================
// ================================================================================

async function selectAccountToWorkWith_PROTO() {
    console.log("Select Action: ");
    console.log("               existing accounts:");
    console.log("                 [i]=[action]");
    console.log("                     [i]=[0,1,2]");
    console.log("                     [action]=[cont, block]");

    console.log("               add new account  ");
    console.log("                 [NEW]");
    for (let i in runExistingAccount) {
        const exAcc = runExistingAccount[i];
        console.log(`[${i}] - ${exAcc.id}`);
        console.log(
            `accountExpertModeCreated : ${exAcc.accountExpertModeCreated}    |    `,
            `billingSetup : ${exAcc.billingSetup}    |    `,
            `scriptAdded : ${exAcc.scriptAdded}    |    `,
            `scriptLaunched : ${exAcc.scriptLaunched}    |    `
        );
    }
    // add prompt here
    for (let i = 0; i < 10; i++) {
        var continVar = prompt(`Select account and action (attempt ${i}):`);
        if (!continVar) continue;
        if (continVar === "exit") break;
        if (continVar.toUpperCase() === "NEW") {
            // add new Account
        }
        const splitedPromt = continVar.split("=");
        if (splitedPromt.length !== 2) {
            console.log("!!!!   Check input and try again");
            continue;
        }
        const indx = splitedPromt[0];
        const cmd = splitedPromt[1];
        if (indx in runExistingAccount && ["cont", "block"].includes(cmd)) {
            // selectt right account
            console.log("");
            console.log("");
            console.log("SELECTED ACCOUNT ");
            console.log(runExistingAccount[indx]);
            break;
        } else {
            console.log("      !!!!! Command was not recognized! Try again");
        }
    }
}

// ================================================================================
// ================================================================================
async function runScript({ page }) {
    const currUrl = await page.url();
    await page.goto("https://ads.google.com/aw/bulk/scripts/management?hl=en&" + currUrl.split("?")[1]);
    await page.waitForTimeout(15000);

    const rowsWithScripts = await page.$$('div[role="row"]');
    console.log("rowsWithScripts.length", rowsWithScripts.length);
    for (let row of rowsWithScripts) {
        const freqButton = await row.$('div[class*="frequency"]');
        if (!freqButton) continue;
        await freqButton.click();
        await page.waitForTimeout(2000);

        const dropDownSelect = await page.$$('material-dropdown-select[class*="options-dropdown"]');
        dropDownSelect.forEach(async (el) => {
            const elInnerText = await el.evaluate((el2) => el2.innerText);
            if (elInnerText.includes("aily")) {
                await el.click();
            }
        });

        const itemsFromMenu = await page.$$('material-list-item[role="listitem"]');
        for (let item of itemsFromMenu) {
            const innerText = await item.evaluate((el) => el.innerText);
            if (innerText.includes("ourly")) {
                item.click();
                break;
            }
        }
    }
    return;

    let scriptOpenned = false;
    if (createdScriptLinks) {
        for (let link of createdScriptLinks) {
            try {
                await link.click();
                scriptOpenned = true;
                const url = await page.url();
                await page.waitForTimeout(5000);
                if (!url.includes("edit")) {
                    throw "Url does not changed";
                }
                break;
            } catch (e) {
                console.log("scriptOpenned3", scriptOpenned);
                scriptOpenned = false;
                continue;
            }
            // if(scriptOpenned) break;
        }
    } else {
        console.log("scriptOpenned2", scriptOpenned);
        scriptOpenned = false;
    }
}

async function insertScript({ page }) {
    const currUrl = await page.url();
    await page.goto("https://ads.google.com/aw/bulk/scripts/management?hl=en&" + currUrl.split("?")[1]);
    await page.waitForTimeout(15000);

    const createdScriptLinks = await page.$$("a.script-name-link");
    let scriptOpenned = false;
    if (createdScriptLinks) {
        for (let link of createdScriptLinks) {
            try {
                await link.click();
                scriptOpenned = true;
                const url = await page.url();
                await page.waitForTimeout(5000);
                if (!url.includes("edit")) {
                    throw "Url does not changed";
                }
                break;
            } catch (e) {
                console.log("scriptOpenned3", scriptOpenned);
                scriptOpenned = false;
                continue;
            }
            // if(scriptOpenned) break;
        }
    } else {
        console.log("scriptOpenned2", scriptOpenned);
        scriptOpenned = false;
    }

    console.log("scriptOpenned", scriptOpenned);
    if (!scriptOpenned) {
        const addNewScriptButton = await page.$('material-fab[navi-id="toolbelt-fab-add-button"]');
        await addNewScriptButton.click();
    }
    await page.waitForTimeout(15000);

    const textToInsert = "function main() {\n\n}";

    const codeMirror = await page.$('div[class*="CodeMirror"]');
    await codeMirror.click();
    await page.waitForTimeout(5000);
    await page.keyboard.down("Control");
    await page.keyboard.press("KeyA");
    await page.keyboard.up("Control");
    await page.waitForTimeout(2000);
    await page.keyboard.press("Backspace");

    await codeMirror.click();

    // const util = require("util");
    // require("child_process").spawn("clip").stdin.end(util.inspect("content_for_ \n\nthe_clipboard"));

    const clipboardy = require("clipboardy");

    clipboardy.writeSync("function main(){ \n\n// 213;\n}");

    await page.waitForTimeout(2000);
    await page.keyboard.down("Control");
    await page.keyboard.press("KeyV");
    await page.keyboard.up("Control");
    await page.waitForTimeout(2000);

    const saveButton = await page.$('material-button[class*="save-button"]');
    await saveButton.click();

    await page.waitForTimeout(15000);
    await page.goto("https://ads.google.com/aw/bulk/scripts/management?hl=en&" + currUrl.split("?")[1]);
    await page.waitForTimeout(15000);
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
// ================================================================================
// ================================================================================

async function clickAddNewAccountButton({ page, emailToWorkWith, session }) {
    await page.waitForTimeout(2000);

    const attemptsAccounts = {};
    const adsAccountIdToWorkWith = null;
    while (true) {
        const accountsExist = await page.$$("material-list-item");
        let accountToSetup = null;
        for (let exAcc of accountsExist) {
            const oldAccountsEl = await exAcc.$('span[class*="material-list-item-secondary"]');
            const adsAccountId = await oldAccountsEl.evaluate((el2) => el2.innerText);
            console.log(emailToWorkWith.email, adsAccountId);
            if (emailToWorkWith.adsAccounts[adsAccountId.trim()].wasInAccount) continue;
            const getIdSelegtor = await exAcc.$("span");
            const isSetupInProgress = await exAcc.evaluate(
                (el) => el.innerText.includes("etup") && el.innerText.includes("progress")
            );
            if (!isSetupInProgress) continue;
            let getId = await getIdSelegtor.evaluate((el) => el.innerText);
            getId = getId.replaceAll(" ", "");
            adsAccountIdToWorkWith = getId;
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

            const accountIdEl = await page.$("div[title]");
            const accountId = await accountIdEl.evaluate((el) => el.getAttribute("title"));
            // const urlOfNewAccount = console.log(accountId);
            emailToWorkWith.adsAccounts[accountId.trim()] = {
                accountExpertModeCreated: false,
                billingSetup: false,
                scriptAdded: false,
                scriptLaunched: false,
                wasInAccount: false,
                suspended: false,
                blocked: false,
                completed: false,
                inWork: false,
                tail: null,
            };
            fs.writeFileSync(`./sessions/${session.profileId}.json`, JSON.stringify(session));

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
    emailToWorkWith.adsAccounts[adsAccountIdToWorkWith].inWork = true;
    emailToWorkWith.adsAccounts[adsAccountIdToWorkWith].tail = urlToOpenExpertMode.split("?")[1];

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
    fs.writeFileSync(`./sessions/${session.profileId}.json`, JSON.stringify(session));

    return { ok: true, message: "Account Was Created" };
}
// ================================================================================
// ================================================================================
async function radioButtonOnRegistration({ page }) {
    try {
        const radioButton = await page.$$("material-radio");
        await radioButton[Math.floor(Math.random(radioButton.length))].click();
    } catch (error) {
        console.log("radioButtonOnRegistration catch ...................");
        console.log(error);
    }
}
// ================================================================================
// ================================================================================

async function submitOnRegistration({ page }) {
    await page.waitForTimeout(3000);

    const submitButton = await page.$('material-button[class*="account-activation-button"]');
    await submitButton.click();

    await page.waitForTimeout(13000);
}
// ================================================================================
// ================================================================================

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
// ================================================================================
// ================================================================================
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
            console.log("selectCountryOnRegistration ..... catch  ...........");
            console.log(error);
            await page.goto("https://ads.google.com/aw/signup/expert?hl=en&" + urlToOpenExpertMode.split("?")[1]);
            await page.waitForTimeout(5000);
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
// ================================================================================
// ================================================================================

module.exports = {
    addNewAdsAccount,
};
