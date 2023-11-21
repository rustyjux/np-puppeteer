const puppeteer = require('puppeteer');

async function captureScreenshot(url, darkMode) {
    const browser = await puppeteer.launch({
        headless: "new"
    });
    try {
        // Capture the screenshot
        const page = await browser.newPage();
        const timeout = 10000; 
        page.setDefaultTimeout(timeout);
        {
            console.log('New page')
            const targetPage = page;
            await targetPage.setViewport({width: 2160, height: 1920});
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
        await waitTillHTMLRendered(page)
        console.log(`Capturing screenshot - dark mode? ${darkMode}`)
        if (darkMode === true) {
            {
                const targetPage = page;
                await puppeteer.Locator.race([
                    targetPage.locator('div.map-settings > button'),
                    targetPage.locator('::-p-xpath(/html/body/app-root/div/app-ski-area/div/div/div/npl-map-libre/div/div/div[3]/button)'),
                    targetPage.locator(':scope >>> div.map-settings > button')
                ])
                    .setTimeout(timeout)
                    .click({
                      offset: {
                        x: 15,
                        y: 14,
                      },
                    });
            }
            {
                const targetPage = page;
                await puppeteer.Locator.race([
                    targetPage.locator('::-p-aria(Dark) >>>> ::-p-aria([role=\\"image\\"])'),
                    targetPage.locator('button:nth-of-type(2) > ion-img >>>> img'),
                    targetPage.locator(':scope >>> button:nth-of-type(2) > ion-img >>>> :scope >>> img')
                ])
                    .setTimeout(timeout)
                    .click({
                      offset: {
                        x: 31,
                        y: 28,
                      },
                    });
            }
            {
                const targetPage = page;
                await puppeteer.Locator.race([
                    targetPage.locator('div.map-settings > div > span'),
                    targetPage.locator('::-p-xpath(/html/body/app-root/div/app-ski-area/div/div/div/npl-map-libre/div/div/div[3]/div/span)'),
                    targetPage.locator(':scope >>> div.map-settings > div > span')
                ])
                    .setTimeout(timeout)
                    .click({
                      offset: {
                        x: 13,
                        y: 15,
                      },
                    });
            }
            await delay(2000);
        }
        console.log('Capturing screenshot')
        // const map = await page.$('body > app-root > div > app-ski-area > div > div > div');
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

const waitTillHTMLRendered = async (page, timeout = 120000) => { // TODO - figure out acceptable timeout
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
      await page.waitForTimeout(checkDurationMsecs);
    }  
  };

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));


captureScreenshot("https://nordic-pulse.com/ski-areas/CA/BC/Black-Jack-Ski-Club/map?print=true&header=false&dark=true", false);
