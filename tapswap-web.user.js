// ==UserScript==
// @name         TapSwap web izni
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Running TapSwap in a browser
// @author       handev
// @match        *://app.tapswap.club/*
// @grant        none
// @icon         https://raw.githubusercontent.com/oguzhanyazman/TapSwap-On-Webbrowser-AutoClicker/main/output_2410894730_1.jpg
// @downloadURL  https://github.com/oguzhanyazman/TapSwap-On-Webbrowser-AutoClicker/raw/main/tapswap-web.user.js
// @updateURL    https://github.com/oguzhanyazman/TapSwap-On-Webbrowser-AutoClicker/raw/main/tapswap-web.user.js
// @homepage     https://github.com/oguzhanyazman/TapSwap-On-Webbrowser-AutoClicker
// ==/UserScript==

(function() {
    'use strict';

    function replaceScriptUrl() {

        const oldUrl = 'https://telegram.org/js/telegram-web-app.js';
        const newUrl = 'https://ktnff.tech/universal/telegram-web-app.js';

        const scripts = document.getElementsByTagName('script');
        for (let script of scripts) {
            if (script.src === oldUrl) {
                const newScript = document.createElement('script');
                newScript.src = newUrl;
                newScript.type = 'text/javascript';
                script.parentNode.replaceChild(newScript, script);
                console.log('Script URL replaced:', newScript.src);
            }
        }
    }

    function checkAndReload() {
        if (document.querySelector('div._leaveContainer_rxbn1_1')) {
            console.log('Class _leaveContainer_rxbn1_1 found, reloading page.');
            location.reload();
        }
    }

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                replaceScriptUrl();
                checkAndReload();
            }
        });
    });

    const config = {
        childList: true,
        subtree: true
    };

    observer.observe(document.body, config);

    replaceScriptUrl();
    checkAndReload();
})();
