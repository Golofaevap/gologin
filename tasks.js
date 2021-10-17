const { createTask } = require("./utils");
// -------------------------------------------------------------------------------------

const { fillPayNewForm, openSettings } = require("./functions/pay.google.com");
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

async function enrichTasksWithFunctions(steps) {
    console.log("enrichTasksWithFunctions ....");
    console.log("steps.length", steps.length);
    for (let s of steps) {
        const { name } = s;
        if (name === "openPaySettings") {
            s.main = openSettings;
        }
    }
}

module.exports = {
    openPaySettings,
    enrichTasksWithFunctions,
};
