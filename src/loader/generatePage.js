import { IndexDBWrapper } from "../helpers/IndexDBWrapper.js";
const { ipcRenderer } = require("electron");
async function obtainGameClient() {
    const highspellAssetsURL = "https://highspell.com:3002/assetsClient";
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

    return Promise.resolve(highSpellClient);
}

async function obtainHighliteCore() {
    const highliteCoreAPIURL = "https://api.github.com/repos/Highl1te/Core/releases/latest";
    const highliteCoreURL = "https://github.com/Highl1te/Core/releases/latest/download/highliteCore.js";
    const highliteDB = new IndexDBWrapper();
    await highliteDB.init();
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

    return Promise.resolve(highliteCore);
}

async function generatePage() {
    // POST Request to https://highspell.com/game
    const urlencoded = new URLSearchParams();
    urlencoded.append("submit", "World+1");
    urlencoded.append("serverid", "1");
    urlencoded.append("serverurl", "https://server1.highspell.com:8888");

    const response = await fetch("https://highspell.com/game", { method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"}, body: urlencoded, redirect: "follow"});
    const text = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    const clientJS = doc.querySelector('script[src*="/js/client/client"]')
    if (clientJS) {
        clientJS.remove();
    }
    
    // Replace head and body content (non-script)
    Array.from(doc.head.children).forEach(child => {
        if (child.tagName.toLowerCase() !== "script") {
            // If child has a relative href, update it to absolute
            if (child.hasAttribute("href")) {
                const href = child.getAttribute("href");
                if (href.startsWith("/")) {
                    child.setAttribute("href", "https://highspell.com" + href);
                }
            }
            document.head.appendChild(child.cloneNode(true));
        }
    });

    Array.from(doc.body.children).forEach(child => {
        if (child.tagName.toLowerCase() !== "script") {
            // If child has a relative href, update it to absolute
            if (child.hasAttribute("href")) {
                const href = child.getAttribute("href");
                if (href.startsWith("/")) {
                    child.setAttribute("href", "https://highspell.com" + href);
                }
            }

            // Append the child
            document.body.appendChild(child.cloneNode(true));
        }
    });

    // Process and inject scripts manually
    const scripts = doc.querySelectorAll("script");
    scripts.forEach(script => {
        const newScript = script.cloneNode(true);
        // if script was in head, append to head
        if (script.parentNode.tagName.toLowerCase() === "head") {
            document.head.appendChild(newScript);
        } else {
            // if script was in body, append to body
            document.body.appendChild(newScript);
        }
    });

    /* Find DOM elements with the attribute to= */
    const toElements = document.querySelectorAll("[to]");
    toElements.forEach(element => {
        console.warn(element);
        const to = element.getAttribute("to");
        const targetElement = document.querySelector(to);

        // Check if the element has a before or after attribute
        const before = element.getAttribute("before");
        const after = element.getAttribute("after");

        // If before is set, insert the element before the target element
        if (before && !after) {
            const beforeElement = document.querySelector(before);
            if (beforeElement) {
                element.remove();
                beforeElement.parentNode.insertBefore(element, beforeElement);
            }
        } else if (after && !before) {
            // If after is set, insert the element after the target element
            const afterElement = document.querySelector(after);
            if (afterElement) {
                element.remove();
                afterElement.parentNode.insertBefore(element, afterElement.nextSibling);
            }
        } else if (!after && !before) {
            // If neither before nor after is set, append the element to the target element
            // This is the default behavior
            if (targetElement) {
                element.remove();
                targetElement.appendChild(element);
            }
        } else if (after && before) {
            // If both before and after are set, log a warning
            console.warn("Element has both before and after attributes. Peforming default behavior.");
            if (targetElement) {
                element.remove();
                targetElement.appendChild(element);
            }
        }
    });


    // Page Setup Completed, Add Game Client Script
    const clientScript = document.createElement("script");
    clientScript.id = "highspellClientScript"
    clientScript.textContent = await obtainGameClient();
    document.body.append(clientScript);

    // Page Setup Completed, Add Highlite Core Script
    const highliteCoreScript = document.createElement("script");
    highliteCoreScript.id = "highliteCoreScript"
    highliteCoreScript.textContent = await obtainHighliteCore();
    document.body.append(highliteCoreScript);

    ipcRenderer.send("ui-ready")

    // Fire a new DOMContentLoaded event
    document.dispatchEvent(new Event("DOMContentLoaded", {
        bubbles: true,
        cancelable: true
    }));
}


await generatePage();
