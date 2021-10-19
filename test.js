const puppeteer = require("puppeteer-core");
const GoLogin = require("gologin");
const { fillPayNewForm, openSettings } = require("./functions/pay.google.com");
const { addNewAdsAccount, createAdsAccountInExpertMode } = require("./functions/ads.google.com");

const path = require("path");
const fs = require("fs");

const {
    createTask,
    executeTask,
    readAllEmailsInLog,
    readSession,
    jsCopy,
    selectEmailInAccountToWorkWith,
    deBug,
} = require("./utils");
const {
    openPaySettings,
    enrichTasksWithFunctions,
    createPHAdsAccount,
    selecAdsAccountToWork,
    createAdsAccountinExpertMode_taskCreator,
    taskSetupBillingInAdsAccount_taskCreator,
    taskScriptAddedInAdsAccount_creator,
    taskScriptLaunchedInAdsAccount_creator,
} = require("./tasks");
var prompt = require("syncprompt");
const phScenario = require("./scenarios/ph-auto");
// console.log(fillPayNewForm);

// ----------------------------------------------------
async function fillSessionWithFunctions(session) {
    const taskOpenPaySettings = await openPaySettings();
    const taskCreatePHAdsAccount = await createPHAdsAccount();
    const taskSelecAdsAccountToWork = await selecAdsAccountToWork();
    const taskCreateAccountInExperMode = await createAdsAccountinExpertMode_taskCreator();
    const taskSetupBillingInAdsAccount = await taskSetupBillingInAdsAccount_taskCreator();
    const taskScriptAddedInAdsAccount = await taskScriptAddedInAdsAccount_creator();
    const taskScriptLaunchedInAdsAccount = await taskScriptLaunchedInAdsAccount_creator();
    session.funcs = {
        taskOpenPaySettings,
        taskCreatePHAdsAccount,
        taskSelecAdsAccountToWork,
        taskCreateAccountInExperMode,
        taskSetupBillingInAdsAccount,
        taskScriptAddedInAdsAccount,
        taskScriptLaunchedInAdsAccount,
    };
}
// ----------------------------------------------------
// ----------------------------------------------------
async function createStepsForGmailAccount(emailToWorkWith, session) {
    if (!emailToWorkWith) return;
    if (emailToWorkWith.isStepsAdded) {
        await enrichTasksWithFunctions(emailToWorkWith.steps, session);
        return;
    }
    const taskOpenPaySettings = await openPaySettings();
    const taskCreatePHAdsAccount = await createPHAdsAccount();

    emailToWorkWith.steps.push(taskOpenPaySettings);
    emailToWorkWith.steps.push(taskCreatePHAdsAccount);

    emailToWorkWith.isStepsAdded = true;
    await enrichTasksWithFunctions(emailToWorkWith.steps, session);
    fs.writeFileSync(`./sessions/${session.profileId}.json`, JSON.stringify(session));
}
// ----------------------------------------------------
(async () => {
    const profileId = "61672ba69ebeacf3a6f2eb9e";
    const GL2 = new GoLogin({
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MTY3MmJhNjllYmVhYzQxODNmMmViOWMiLCJ0eXBlIjoiZGV2Iiwiand0aWQiOiI2MTY3MmJiNTRiYzNiNjkwNjIyYjJmMWMifQ.1RFtqZfIW2AXyHY5xpVnxFjnXwXaOWqT68SAY5bexM8",
        profile_id: profileId,
    });

    const session = await readSession(profileId);
    const { status, wsUrl } = await GL2.start();

    const browser = await puppeteer.connect({
        browserWSEndpoint: wsUrl.toString(),
        ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    if (!session.emailFound) {
        await readAllEmailsInLog(page, session);
    }
    session.save = null;

    const saveSession = (session) => {
        const current = session.current;
        session.current = null;
        fs.writeFileSync(`./sessions/${session.profileId}.json`, JSON.stringify(session));
        session.current = current;
    };

    session.save = saveSession;
    // session.save = () => {
    //     const current = this.current;
    //     this.current = null;
    //     fs.writeFileSync(`./sessions/${this.profileId}.json`, JSON.stringify(this));
    //     this.current = this.current;
    // };

    const emailToWorkWith = await selectEmailInAccountToWorkWith(page, session);
    session.current = {
        gmail: emailToWorkWith.email,
    };
    console.log("emailToWorkWith", emailToWorkWith.email);

    // await createStepsForGmailAccount(emailToWorkWith, session);
    await fillSessionWithFunctions(session);

    // const taskOpenPaySettings = await openPaySettings();
    let att = {
        completed: false,
        attemptIndex: 0,
        attempts: [],
    };
    // for (let func of phScenario) {
    //     console.log(func);
    //     console.log(session.current);
    // }

    // gmail is known ----- -------
    // console.log(session, "\n\n\n\n")
    if (!session.userEmails[session.current.gmail].isCardAdded) {
        deBug(`if (!session.userEmails[session.current.gmail].isCardAdded) {`);
        let result = await executeTask(
            session.funcs["taskOpenPaySettings"],
            { page, emailToWorkWith, session },
            jsCopy(att),
            page
        );
        result.funcName = session.funcs["taskOpenPaySettings"].name;
        if (!result.completed) {
            session.save(session);
            await browser.close();
            await GL2.stop();
            return;
        }
        session.userEmails[session.current.gmail].isCardAdded = true;
        session.save(session);
    }

    // card added into selected gmail here;
    // session.current.ads = "382-203-7656"; // временно
    if (!session.current.ads) {
        let result = await executeTask(
            session.funcs["taskSelecAdsAccountToWork"],
            { page, emailToWorkWith, session },
            jsCopy(att),
            page
        );
        result.funcName = session.funcs["taskSelecAdsAccountToWork"].name;
        if (!result.completed) {
            session.save(session);
            await browser.close();
            await GL2.stop();
            return;
        }
        // session.userEmails[session.current.gmail].isCardAdded = true;
        // session.save(session);
    }

    // console.log("\n\n\nsession after ads account found", session.current, session.userEmails[session.current.gmail]);

    if (!session.userEmails[session.current.gmail].adsAccounts[session.current.ads].accountExpertModeCreated) {
        let result = await executeTask(
            session.funcs["taskCreateAccountInExperMode"],
            { page, emailToWorkWith, session },
            jsCopy(att),
            page
        );
        result.funcName = session.funcs["taskCreateAccountInExperMode"].name;
        if (!result.completed) {
            session.save(session);
            await browser.close();
            await GL2.stop();
            return;
        }
        session.userEmails[session.current.gmail].adsAccounts[session.current.ads].accountExpertModeCreated = true;
        session.save(session);
    }
    // else {
    //     console.log("PROBLEM OPPEN ADS ACCOUNT");
    //     console.log(session.current.gmail, session.current.ads);
    //     await browser.close();
    //     await GL2.uploadProfileCookiesToServer();
    //     await GL2.stop();
    //     return console.log("PROBLEM OPPEN ADS ACCOUNT");
    // }

    if (!session.userEmails[session.current.gmail].adsAccounts[session.current.ads].billingSetup) {
        let result = await executeTask(
            session.funcs["taskSetupBillingInAdsAccount"],
            { page, emailToWorkWith, session },
            jsCopy(att),
            page
        );
        result.funcName = session.funcs["taskSetupBillingInAdsAccount"].name;
        if (!result.completed) {
            session.save(session);
            await browser.close();
            await GL2.stop();
            return;
        }
        session.userEmails[session.current.gmail].adsAccounts[session.current.ads].billingSetup = true;
        session.save(session);
    }
    // else {
    //     console.log("PROBLEM OPPEN ADS ACCOUNT");
    //     console.log(session.current.gmail, session.current.ads);
    //     await browser.close();
    //     await GL2.uploadProfileCookiesToServer();
    //     await GL2.stop();
    //     return console.log("PROBLEM OPPEN ADS ACCOUNT");
    // }
    if (!session.userEmails[session.current.gmail].adsAccounts[session.current.ads].scriptAdded) {
        let result = await executeTask(
            session.funcs["taskScriptAddedInAdsAccount"],
            { page, emailToWorkWith, session },
            jsCopy(att),
            page
        );
        result.funcName = session.funcs["taskScriptAddedInAdsAccount"].name;
        if (!result.completed) {
            session.save(session);
            await browser.close();
            await GL2.stop();
            return;
        }
        session.userEmails[session.current.gmail].adsAccounts[session.current.ads].scriptAdded = true;
        session.save(session);
    }
    // else {
    //     console.log("PROBLEM OPPEN ADS ACCOUNT");
    //     console.log(session.current.gmail, session.current.ads);
    //     await browser.close();
    //     await GL2.uploadProfileCookiesToServer();
    //     await GL2.stop();
    //     return console.log("PROBLEM OPPEN ADS ACCOUNT");
    // }

    if (!session.userEmails[session.current.gmail].adsAccounts[session.current.ads].scriptLaunched) {
        let result = await executeTask(
            session.funcs["taskScriptLaunchedInAdsAccount"],
            { page, emailToWorkWith, session },
            jsCopy(att),
            page
        );
        result.funcName = session.funcs["taskScriptLaunchedInAdsAccount"].name;
        if (!result.completed) {
            session.save(session);
            await browser.close();
            await GL2.stop();
            return;
        }
        session.userEmails[session.current.gmail].adsAccounts[session.current.ads].scriptLaunched = true;
        session.save(session);
    }

    console.log("EXECUTION COMPLETED");

    // console.log(await page.content());
    // await browser.close();
    // await GL2.uploadProfileCookiesToServer();
    // await GL2.stop();
    // await GL.stop();
    return;
})();
