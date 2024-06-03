/**
 * A different version of the script so that it can be executed and
 * downloaded in a browser
 *
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

const fileTitle = "# HOLO TACO Product Checklist\n\n";
let productList = "";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generate").addEventListener("click", getAllProducts);
});

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
  downloadMarkdown(fileTitle + productList);
}

function parseProductNames(data, productLineIndex) {
  const products = data.products;
  productList += "## " + productLines[productLineIndex] + "\n";
  for (let index = 0; index < products.length; index++) {
    productList += "- [ ] " + products[index].title + "\n";
  }
}

function downloadMarkdown(content) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ProductChecklist.md";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
