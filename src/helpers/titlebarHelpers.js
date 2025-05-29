const { ipcRenderer } = require("electron");

let ogError = console.error;
console.error = function(...args) {
    ogError(...args);
    const warningIndicator = document.querySelector('#warningIndicator');
    if (warningIndicator) {
        warningIndicator.style.color = 'red';
        warningIndicator.display = 'unset';
    }
    // On click open dev tools
    warningIndicator.onclick = () => {
        ipcRenderer.send('show-dev-tools');
        warningIndicator.style.display = 'none';
    };
};
let ogWarn = console.warn;
console.warn = function(...args) {
    ogWarn(...args);
    const warningIndicator = document.querySelector('#warningIndicator');
    if (warningIndicator) {
        if (warningIndicator.style.color !== 'red') {
            warningIndicator.style.color = 'yellow';
        }
        warningIndicator.style.display = 'unset';
    }
    // On click open dev tools
    warningIndicator.onclick = () => {
        ipcRenderer.send('show-dev-tools');
        warningIndicator.style.display = 'none';
    };
};
setInterval(() => {
    const titlebar = document.querySelector('#iconbar');
    if (titlebar) {
        titlebar.style.left = `calc(env(titlebar-area-width, 100%) - ${titlebar.offsetWidth}px - 10px)`;
    }
}, 100);