import { fetchSeasonsMatches } from "./eashl-api/index.js"
import { map, prop } from "ramda"

const myArgs = process.argv.slice(2);

fetchSeasonsMatches("common-gen5")(myArgs[0])
  .then(x => map(y => console.table(y.playerStats))(x.matches))
  .catch(console.log)