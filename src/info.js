import { fetchClubInfo } from "./eashl-api/index.js"
import { map, path } from "ramda"

// const myArgs = process.argv.slice(2);
// fetchClubInfo(myArgs[0])(myArgs[1])
//   .then(x => console.table([x.info]))
//   .catch(console.log)


  const ids = [
    "53183",
    "3066",
    "9468",
    "3505",
    "14751"
  ]

Promise.all(map(fetchClubInfo("common-gen5"))(ids))
  .then(x => console.table(map(path(["info","name"]))(x)))
  .catch(e => console.log("error"));