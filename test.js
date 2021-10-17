const puppeteer = require("puppeteer-core");
const GoLogin = require("gologin");
const { fillPayNewForm, openSettings } = require("./functions/pay.google.com");
const { addNewAdsAccount } = require("./functions/ads.google.com");

const path = require("path");
const fs = require("fs");

const {
    createTask,
    executeTask,
    readAllEmailsInLog,
    readSession,
    jsCopy,
    selectEmailInAccountToWorkWith,
} = require("./utils");
const { openPaySettings, enrichTasksWithFunctions } = require("./tasks");
var prompt = require("syncprompt");
// console.log(fillPayNewForm);

// ----------------------------------------------------
async function createStepsForGmailAccount(emailToWorkWith, session) {
    if (!emailToWorkWith) return;
    if (emailToWorkWith.isStepsAdded) {
        await enrichTasksWithFunctions(emailToWorkWith.steps);
        return;
    }
    const taskOpenPaySettings = await openPaySettings();

    emailToWorkWith.steps.push(taskOpenPaySettings);

    emailToWorkWith.isStepsAdded = true;
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

    // const result = await openSettings({ page, card: card[0] });

    // console.log("result =", result);
    // return;

    const emailToWorkWith = await selectEmailInAccountToWorkWith(page, session);
    console.log("emailToWorkWith", emailToWorkWith);

    await createStepsForGmailAccount(emailToWorkWith, session);

    // const taskOpenPaySettings = await openPaySettings();
    let att = {
        completed: false,
        attemptIndex: 0,
        attempts: [],
    };

    // console.log(taskOpenPaySettings);
    for (let i in emailToWorkWith.steps) {
        if (!emailToWorkWith.steps[i].completed) {
            console.log(emailToWorkWith.steps[i]);
            let result = await executeTask(emailToWorkWith.steps[i], { page }, jsCopy(att), page);
            result.funcName = emailToWorkWith.steps[i].name;
            emailToWorkWith.history.push(result);
            if (!result.completed) {
                fs.writeFileSync(`./sessions/${session.profileId}.json`, JSON.stringify(session));
                await browser.close();
                await GL2.stop();
                return;
            }
            emailToWorkWith.steps[i].completed = true;
            fs.writeFileSync(`./sessions/${session.profileId}.json`, JSON.stringify(session));
        }
    }
    // let cardsAttempt = 111;
    // while (cardsAttempt < 10) {
    //     cardsAttempt++;
    //     const result2 = await openSettings({ page, card: card[cardsAttempt] });
    //     console.log(result2);
    //     if (result2.ok) {
    //         break;
    //     }
    // }

    // await fillPayNewForm({ page, card });

    // console.log("second:", session);

    // for (let gmAccIter in session.userEmails) {
    //     const gmailAccount = session.userEmails[gmAccIter];
    //     if (gmailAccount.isSingout) continue;
    //     if (gmailAccount.isUsed) continue;
    //     await addNewAdsAccount({ page, offer: null, gmailAccount, session });
    // }
    console.log("EXECUTION COMPLETED");
    return;

    // console.log(await page.content());
    // await browser.close();
    // await GL.stop();
    // await GL2.stop();
})();
