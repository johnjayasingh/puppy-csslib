const fs = require("fs");
const yaml = require("yaml");
/**
 *
 * @param {*} filePath input File Path to be used for extracting data from the pupeteer page
 * @returns
 */
module.exports = (filePath) => {
  const file = fs.readFileSync(filePath, "utf8");
  const data = yaml.parse(file);
  return {
    /**
     *
     * @param {*} page Pupeteer page instance
     * @returns parsed json object
     */
    extract: async (page) => {
      const itemsResult = await page.evaluate((data) => {
        const item_selector = data.selector;

        const results = [];

        const items = document.body.querySelectorAll(item_selector);
        items.forEach((item, index) => {
          /* Get and format Rating */
          const obj = {};
          data.header.forEach(
            ({ id, selector, type = "Text", attribute, replace, root }) => {
              obj[id] = item.querySelector(selector);
              if (root) {
                obj[id] = document.querySelector(selector);
              }
              // If you have to click to expand to view all the contents
              if (data.read_more_selector) {
                const readMore = item.querySelector(data.read_more_selector);
                if (readMore) {
                  readMore.click();
                }
              }
              // If taken
              if (obj[id]) {
                // Get the text content
                if (type === "Text") {
                  obj[id] = obj[id].textContent.trim();
                } else if (type === "Attribute" && attribute) {
                  obj[id] = obj[id].getAttribute(attribute).trim();
                }
                // If replace text required do it
                if (obj[id] && replace) {
                  replace.forEach((repStr) => {
                    obj[id] = obj[id].replace(repStr, "");
                  });
                }
              }
              results.push(obj);
            }
          );
        });
        return results;
      }, data);
      return itemsResult;
    },
  };
};
