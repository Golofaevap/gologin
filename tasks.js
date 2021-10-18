const { createTask } = require("./utils");
// -------------------------------------------------------------------------------------

const { fillPayNewForm, openSettings } = require("./functions/pay.google.com");
const { addNewAdsAccount } = require("./functions/ads.google.com");
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------

// createTask(func, descs, url);
const openPaySettings = async () => {
    const name = "openPaySettings";
    const url = "https://pay.google.com/gp/w/u/0/home/settings?hl=en";
    const descs = [
        "Result of the function is added card to payment profile",
        "Manual execution: ",
        " -- be sure that payment profile added to account",
        " -- card added to payment profile",
    ];
    return await createTask(openSettings, descs, url, name);
};


const createPHAdsAccount = async () => {
    const name = "createPHAdsAccount";
    const url = "https://ads.google.com/selectaccount?hl=en";
    const descs = [
        "Result of the function is created account for Philippines",
        "Manual execution: ",
        " -- be sure that ads account creted on philippines and currency is PHP",
    ];
    return await createTask(addNewAdsAccount, descs, url, name);
};

async function enrichTasksWithFunctions(steps, session) {
    session.funcs = {};
    console.log("enrichTasksWithFunctions ....");
    console.log("steps.length", steps.length);
    for (let s of steps) {
        const { name } = s;
        if (name === "openPaySettings") {
            s.main = openSettings;
        }
        if (name === "createPHAdsAccount") {
            s.main = addNewAdsAccount;
        }
        session.funcs[name] = s;
    }
}

module.exports = {
    openPaySettings,
    createPHAdsAccount,
    enrichTasksWithFunctions,
};
