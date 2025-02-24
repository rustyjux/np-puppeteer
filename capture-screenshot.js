const puppeteer = require('puppeteer');

async function captureScreenshot(url) {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox']
    });
    try {
        // Capture the screenshot
        const page = await browser.newPage();
        const timeout = 30000; 
        page.setDefaultTimeout(timeout);
        {
            console.log('New page')
            const targetPage = page;
            await targetPage.setViewport({width: 1080, height: 1920});
        }
        {
            console.log('Loading')
            const targetPage = page;
            const promises = [];
            const startWaitingForEvents = () => {
                promises.push(targetPage.waitForNavigation());
            }
            startWaitingForEvents();
            await targetPage.goto(url);
            await Promise.all(promises);
        }
        console.log('Capturing screenshot')
        await waitTillHTMLRendered(page)
        const map = page
        // await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
        console.log('Returning screenshot')
        await map.screenshot({ path: 'screenshot.png' });
    } catch (error) {
        console.error('Error capturing screenshot:', error);
        throw error;
    } finally {
      await browser.close();
    }
}

const waitTillHTMLRendered = async (page, timeout = 120000) => {
    const checkDurationMsecs = 1000;
    const maxChecks = timeout / checkDurationMsecs;
    let lastHTMLSize = 0;
    let checkCounts = 1;
    let countStableSizeIterations = 0;
    const minStableSizeIterations = 3;
  
    while(checkCounts++ <= maxChecks){
      let html = await page.content();
      let currentHTMLSize = html.length; 
  
      let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);
  
      console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);
  
      if(lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize) 
        countStableSizeIterations++;
      else 
        countStableSizeIterations = 0; //reset the counter
  
      if(countStableSizeIterations >= minStableSizeIterations) {
        console.log("Page rendered fully..");
        break;
      }
  
      lastHTMLSize = currentHTMLSize;
      await delay(checkDurationMsecs);
    }  
};

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));


captureScreenshot("https://nordic-pulse.com/ski-areas/CA/BC/Black-Jack-Ski-Club/map?print=true&header=false&dark=true&hideAppLink=true", false);
