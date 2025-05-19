import { IndexDBWrapper } from "../helpers/IndexDBWrapper.js";
var highliteCoreAPIURL = "https://api.github.com/repos/Highl1te/Core/releases/latest";
var highliteCoreURL = "https://github.com/Highl1te/Core/releases/latest/download/highliteCore.js";
var highspellAssetsURL = "https://highspell.com:3002/assetsClient";


(async function() {
    const highliteDB = new IndexDBWrapper();
    await highliteDB.init();

    // Check if clientLastVersion is set
    const clientLastVersion = await highliteDB.getItem("clientLastVersion");

    // Get Asset JSON to determine latest version
    const highSpellAssetJSON = (await (await fetch(highspellAssetsURL)).json());
    const remoteLastVersion = highSpellAssetJSON.data.latestClientVersion;

    let highSpellClient = "";
    if (clientLastVersion == undefined || clientLastVersion < remoteLastVersion) {
        console.log("[Highlite Loader] High Spell Client Version is outdated, updating...");
        const highSpellClientURL = `https://highspell.com/js/client/client.${highSpellAssetJSON.data.latestClientVersion}.js`;
        highSpellClient = (await (await fetch(highSpellClientURL + "?time=" + Date.now())).text());
        highSpellClient = highSpellClient.substring(0, highSpellClient.length - 9)
        + "; document.client = {};"
        + "document.client.get = function(a) {"
        + "return eval(a);"
        + "};"
        + "document.client.set = function(a, b) {"
        + "eval(a + ' = ' + b);"
        + "};"
        + highSpellClient.substring(highSpellClient.length - 9)
        await highliteDB.setItem("highSpellClient", highSpellClient);
        await highliteDB.setItem("clientLastVersion", remoteLastVersion);
        console.log("[Highlite Loader] High Spell Client Version " + highSpellAssetJSON.data.latestClientVersion + " downloaded.");
    } else {
        console.log("[Highlite Loader] High Spell Client Version is up to date.");
        highSpellClient = await highliteDB.getItem("highSpellClient");
    }

    // Execute the High Spell Client code
    const clientScript = document.createElement("script");
    clientScript.textContent = highSpellClient;
    clientScript.id = "highspellClientScript";
    document.body.appendChild(clientScript);
    
    console.log("[Highlite Loader] High Spell Client Injection Completed.");


    const coreLastUpdated = await highliteDB.getItem("coreLastUpdated");
    const githubReleaseInformation = (await (await fetch(highliteCoreAPIURL)).json());
    let remoteLastUpdated = undefined;
    githubReleaseInformation.assets.forEach((asset) => {
        if (asset.name === "highliteCore.js") {
        remoteLastUpdated = new Date(asset.updated_at);
        }
    });
    let highliteCore = "";
    if (coreLastUpdated == undefined || remoteLastUpdated == undefined || coreLastUpdated < remoteLastUpdated) {
        console.log("[Highlite Loader] Highlite Core Version is outdated, updating...");
        highliteCore = (await (await fetch(highliteCoreURL + "?time=" + Date.now())).text());
        await highliteDB.setItem("highliteCore", highliteCore);
        await highliteDB.setItem("coreLastUpdated", remoteLastUpdated);
    } else {
        console.log("[Highlite Loader] Highlite Core Version is up to date.");
        highliteCore = await highliteDB.getItem("highliteCore");
     }
    console.log("[Highlite Loader] Highlite Core obtained, executing.");
    const coreScript = document.createElement("script");
    coreScript.textContent = highliteCore;
    coreScript.id = "highliteCoreScript";
    document.body.appendChild(coreScript);
    console.log("[Highlite Loader] Highlite Core Injection Completed.");
})();


