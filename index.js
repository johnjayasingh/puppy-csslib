const { ioData } = require("../config");

exports.from_yaml = async (key, page) => {
  const data = ioData()[key];
  const reviews = await page.evaluate((data) => {
    const review_selector = data.selector;

    const results = [];

    const items = document.body.querySelectorAll(review_selector);
    console.log("got items");
    items.forEach((item, index) => {
      /* Get and format Rating */
      console.log("iterating reviews");
      console.log(`${data}`);
      const obj = {};
      data.header.forEach(
        ({ id, selector, type = "Text", attribute, replace, root }) => {
          obj[id] = item.querySelector(selector);
          if (root) {
            obj[id] = document.querySelector(selector);
          }
          if (data.read_more_selector) {
            const readMore = item.querySelector(data.read_more_selector);
            if (readMore) {
              readMore.click();
            }
          }
          if (obj[id]) {
            if (type === "Text") {
              obj[id] = obj[id].textContent.trim();
            } else if (type === "Attribute" && attribute) {
              obj[id] = obj[id].getAttribute(attribute).trim();
            }
            if (obj[id] && replace) {
              replace.forEach((repStr) => {
                obj[id] = obj[id].replace(repStr, "");
              });
            }
          }
        }
      );
      // Extract only if review content found
      if (obj["ReviewContent"] && obj["ReviewContent"]?.length > 0) {
        results.push(obj);
      }
    });
    return results;
  }, data);
  return reviews;
};
