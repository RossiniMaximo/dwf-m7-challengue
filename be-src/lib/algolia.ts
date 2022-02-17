import algoliasearch from "algoliasearch";

const client = algoliasearch("BO7KH091QS", process.env.ALGOLIA_API_KEY);
const indexPets = client.initIndex("pets");

export { indexPets };
