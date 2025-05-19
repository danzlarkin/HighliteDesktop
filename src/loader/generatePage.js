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
}

generatePage();