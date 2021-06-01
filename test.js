const puppyCss = require("./index");
const puppeteer = require('puppeteer')
const filePath = "sample.yaml";

const parser = puppyCss(filePath);

// Example parsing a SPA Website
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.tripadvisor.ca/Airline_Review-d13804006-Reviews-Aero-Mongolia");
  const main_content_selector = "div.oETBfkHU";
  let results = [];
  try {
    while (true) {
      // Wait for the required DOM to be rendered
      try {
        await page.waitForSelector(main_content_selector);
      } catch (error) {
        console.warn(`Error: Selector ${main_content_selector} not loaded`);
        break;
      }
      const reviews = await parser.extract(page);
      results = results.concat(reviews);
      console.info(results.length);
      io.emit("stdout", results.length);
      try {
        await Promise.all([page.click("a.next"), page.waitForTimeout(3000)]);
      } catch (error) {
        console.warn(`Selector a.next not clicked`);
        break;
      }
    }
  } catch (err) {
    console.info("scrapping done");
  } finally {
    console.log(results);
  }

  await browser.close();
})();
