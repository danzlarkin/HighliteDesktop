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


    // If you need to move any of Highlite's elements to a more appropriate location, do it here
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
}

generatePage();