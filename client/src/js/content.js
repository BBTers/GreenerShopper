(async () => {
    const src = chrome.runtime.getURL('client/src/js/main.js');
    const contentScript = await import(src);
    contentScript.main();
})();