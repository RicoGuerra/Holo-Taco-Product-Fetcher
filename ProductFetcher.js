const fs = require("fs");

/**
 * This array is necessary since, by default, the shopify API
 * does not let you fetch more than 250 elements from an api call.
 * That's why I make several seperate calls for the specific product lines
 */
const productLines = [
  "top-base-coats",
  "toppers",
  "cremes",
  "holographic",
  "glitter",
  "iridescent",
  "shimmer",
  "magnetics",
  "chrome-metallic",
  "limited-edition-seasonal",
  "simplys-favourites",
];

// The Markdown list title
const fileTitle = "# HOLO TACO Product Checklist\n \n";

let productList = "";

getAllProducts();

/**
 * Fetches all products from the Holo Taco website via REST call
 *
 * @async
 * @returns {*}
 */
async function getAllProducts() {
  for (let index = 0; index < productLines.length; index++) {
    let apiUrl =
      "https://www.holotaco.com/collections/" +
      productLines[index] +
      "/products.json?limit=250";
    await fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        parseProductNames(data, index);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  writeToFile(fileTitle + productList);
}

/**
 * Extracts all the product names from the json we get as
 * a response from the Holo Taco website
 *
 * @param {*} data
 * the json file
 * @param {*} productLineIndex
 * the corresponding name of the nail polish line
 */
function parseProductNames(data, productLineIndex) {
  const products = data.products;
  productList += "## " + productLines[productLineIndex] + "\n";
  for (let index = 0; index < products.length; index++) {
    productList += "- [ ] " + products[index].title + "\n";
  }
}

/**
 * Creates a Markdown file within the same folder
 * the current script is located
 *
 * @param {*} string
 * The concatenated string of all products
 */
function writeToFile(string) {
  fs.writeFile("ProductChecklist.md", string, (err) => {
    if (err) throw err;
  });
}
