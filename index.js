import settings from "./config"
import ThePlayer from "../Atomx/skyblock/ThePlayer"

const Toolkit = Java.type("java.awt.Toolkit");
const StringSelection = Java.type("java.awt.datatransfer.StringSelection");

let welcomeMessageShown = false;

function welcomeMessage() {
    if (welcomeMessageShown) return;
    ChatLib.chat("&6&l▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬");
    ChatLib.chat("                &b&l✦ BuskeAddons ✦");
    ChatLib.chat("");
    ChatLib.chat("    &a&l✔ &7Module successfully loaded!");
    ChatLib.chat("");
    ChatLib.chat("    &e&l⚡ &7Enjoy your enhanced SkyBlock experience!");
    ChatLib.chat("");
    ChatLib.chat("    &d&l⚙ &7Use &f/buskeaddons &7to access settings");
    ChatLib.chat("&6&l▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬");
    welcomeMessageShown = true;
}

register("worldLoad", () => {
    setTimeout(() => {
        if (ThePlayer.inSkyblock && !welcomeMessageShown) {
            welcomeMessage();
        } else if (!ThePlayer.inSkyblock) {
            welcomeMessageShown = false;
        }
    }, 5000);
});

function sendModMessage(message) {
    ChatLib.chat("&8[&bBuskeAddons&8]&r " + message);
}

// Fairy Souls Counter
let fairySoulsFound = 0;
const MAX_FAIRY_SOULS = 247;

register("chat", (event) => {
    if (settings.getValue('fairySoulCounter') && fairySoulsFound < MAX_FAIRY_SOULS) {
        fairySoulsFound++;
        sendModMessage(`&dFairy Souls found: &e${fairySoulsFound}/${MAX_FAIRY_SOULS}`);
    }
}).setCriteria("SOUL! You found a Fairy Soul!");

// Mining Speed Boost Alert
register("chat", (event) => {
    if (settings.getValue('miningSpeedBoostAlert')) {
        sendModMessage("&aMining Speed Boost is now available!");
        World.playSound("note.pling", 1, 2);
    }
}).setCriteria("Mining Speed Boost is now available!");

register("command", (count) => {
    const newCount = parseInt(count);
    if (isNaN(newCount) || newCount < 0 || newCount > MAX_FAIRY_SOULS) {
        sendModMessage(`&cInvalid count. Please use a number between 0 and ${MAX_FAIRY_SOULS}.`);
    } else {
        fairySoulsFound = newCount;
        sendModMessage(`&dFairy Souls count set to &e${fairySoulsFound}/${MAX_FAIRY_SOULS}`);
    }
}).setName("setfairysouls");

function copyToClipboard(text) {
    const selection = new StringSelection(text);
    const clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
    clipboard.setContents(selection, null);
}

function getPurseFromScoreboard() {
    const scoreboardLines = Scoreboard.getLines().map(line => ChatLib.removeFormatting(line));
    for (const line of scoreboardLines) {
        if (line.includes("Purse:") || line.includes("Piggy:")) {
            return parseScoreboardCurrency(line);
        }
    }
    return null;
}

function parseScoreboardCurrency(unformattedLine) {
    const numberStr = unformattedLine.replace(/[^\d.]/g, '');
    return parseFloat(numberStr);
}

function getPurse() {
    const atomxPurse = ThePlayer.getPurse();
    const scoreboardPurse = getPurseFromScoreboard();
    
    if (atomxPurse > 0) return atomxPurse;
    if (scoreboardPurse !== null) return scoreboardPurse;
    return -1;
}

register("command", () => {
    try {
        const purse = getPurse();
        if (purse !== -1) {
            const purseString = purse.toFixed(0);
            const formattedPurse = purseString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            
            copyToClipboard("Purse: " + formattedPurse);
            
            sendModMessage("&aPurse copied to clipboard: " + formattedPurse + " coins");
        } else {
            sendModMessage("&cUnable to find purse information.");
        }
    } catch (error) {
        sendModMessage("&cError copying purse: " + error.message);
    }
}).setName("copypurse").setAliases(["cpp", "cp"]);

// Keybind handlers
register("key", () => {
    settings.getConfig().openGui();
}).setKey(settings.getValue('openGuiKey'));

register("key", () => {
    settings.setValue('fairySoulCounter', !settings.getValue('fairySoulCounter'));
    const status = settings.getValue('fairySoulCounter') ? "&aenabled" : "&cdisabled";
    sendModMessage(`&dFairy Soul Counter ${status}`);
}).setKey(settings.getValue('toggleFairySoulsKey'));

register("key", () => {
    ChatLib.command("copypurse", true);
}).setKey(settings.getValue('copyPurseKey'));

// Command to open settings GUI
register("command", () => {
    settings.getConfig().openGui();
}).setName("buskeaddons").setAliases("ba", "b");

// Config change listeners
settings.getConfig().registerListener("fairySoulCounter", (previousValue, newValue) => {
    const status = newValue ? "&aenabled" : "&cdisabled";
    sendModMessage(`&dFairy Soul Counter has been ${status}`);
});

settings.getConfig().registerListener("miningSpeedBoostAlert", (previousValue, newValue) => {
    const status = newValue ? "&aenabled" : "&cdisabled";
    sendModMessage(`&cMining Speed Boost Alert has been ${status}`);
});