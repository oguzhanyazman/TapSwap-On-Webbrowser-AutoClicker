// ==UserScript==
// @name         TapSwap Autoclicker
// @namespace    Violentmonkey Scripts
// @match        *://*.tapswap.club/*
// @author       handev
// @version      1.1
// @grant        none
// ==/UserScript==

const minClickDelay = 30;
const maxClickDelay = 50;
const pauseMinTime = 100000;
const pauseMaxTime = 300000;
const energyThreshold = 25; 
const checkInterval = 1500;
const maxCheckAttempts = 3; 

let checkAttempts = 0;

const styles = {
    success: 'background: #28a745; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    starting: 'background: #8640ff; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    error: 'background: #dc3545; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    info: 'background: #007bff; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;'
};
const logPrefix = '%c[TapSwapBot] ';

const originalLog = console.log;
console.log = function () {
    if (typeof arguments[0] === 'string' && arguments[0].includes('[TapSwapBot]')) {
        originalLog.apply(console, arguments);
    }
};

console.error = console.warn = console.info = console.debug = () => { };

console.clear();
console.log(`${logPrefix}Starting`, styles.starting);


function triggerEvent(element, eventType, properties) {
    const event = new MouseEvent(eventType, properties);
    element.dispatchEvent(event);
}

function getRandomCoordinateInCircle(radius) {
    let x, y;
    do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
    } while (x * x + y * y > 1);
    return {
        x: Math.round(x * radius),
        y: Math.round(y * radius)
    };
}

function getCurrentEnergy() {
    const energyElement = document.querySelector("div._value_tzq8x_13 h4._h4_1w1my_1");
    if (energyElement) {
        return parseInt(energyElement.textContent);
    }
    return null;
}

function checkCoinAndClick() {
    const button = document.querySelector("#ex1-layer img");

    if (button) {
        console.log(`${logPrefix}Coin found. The click is executed.`, styles.success);
        clickButton();
    } else {
        checkAttempts++;
        if (checkAttempts >= maxCheckAttempts) {
            console.log(`${logPrefix}Coin not found after 3 attempts. Reloading the page.`, styles.error);
            location.reload();
        } else {
            console.log(`${logPrefix}Coin not found. Attempt  ${checkAttempts}/${maxCheckAttempts}. Check again after 3 seconds.`, styles.error);
            setTimeout(checkCoinAndClick, checkInterval);
        }
    }
}

function clickButton() {
    const currentEnergy = getCurrentEnergy();
    if (currentEnergy !== null && currentEnergy < energyThreshold) {
        const pauseTime = pauseMinTime + Math.random() * (pauseMaxTime - pauseMinTime);
        console.log(`${logPrefix}The energy is lower ${energyThreshold}. Pause for ${Math.round(pauseTime / 1000)} seconds.`, styles.info);
        setTimeout(clickButton, pauseTime);
        return;
    }

    const button = document.querySelector("#ex1-layer img");

    if (button) {
        const rect = button.getBoundingClientRect();
        const radius = Math.min(rect.width, rect.height) / 2;
        const { x, y } = getRandomCoordinateInCircle(radius);

        const clientX = rect.left + radius + x;
        const clientY = rect.top + radius + y;

        const commonProperties = {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: clientX,
            clientY: clientY,
            screenX: clientX,
            screenY: clientY,
            pageX: clientX,
            pageY: clientY,
            pointerId: 1,
            pointerType: "touch",
            isPrimary: true,
            width: 1,
            height: 1,
            pressure: 0.5,
            button: 0,
            buttons: 1
        };

        triggerEvent(button, 'pointerdown', commonProperties);
        triggerEvent(button, 'mousedown', commonProperties);
        triggerEvent(button, 'pointerup', { ...commonProperties, pressure: 0 });
        triggerEvent(button, 'mouseup', commonProperties);
        triggerEvent(button, 'click', commonProperties);

        const delay = minClickDelay + Math.random() * (maxClickDelay - minClickDelay);
        setTimeout(checkCoinAndClick, delay);
    } else {
        console.log(`${logPrefix}Coin not found!`, styles.error);
    }
}

checkCoinAndClick();
