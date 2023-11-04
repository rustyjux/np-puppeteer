const puppeteer = require('puppeteer');

async function captureScreenshot() {
    // Capture the screenshot
    const browser = await puppeteer.launch({headless:"new"});
    const page = await browser.newPage();
    await page.goto('https://nordic-pulse.com/ski-areas/CA/BC/Black-Jack-Ski-Club');
    await page.setViewport({width: 1080, height: 1024});
    await page.waitForSelector('div.trails-toggle-wrap', { visible: true });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 5 seconds
    await page.screenshot({ path: 'screenshot.png' });
    await browser.close();
}

captureScreenshot();
