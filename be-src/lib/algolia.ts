import algoliasearch from "algoliasearch";
require("dotenv").config();
console.log("hola", process.env.ALGOLIA_API_KEY);

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);
const indexPets = client.initIndex(process.env.ALGOLIA_INDEX_NAME);

export { indexPets };
