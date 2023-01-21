import { fetchPlayerInfo } from "./eashl-api/index.js"
import { map, path } from "ramda"

// const myArgs = process.argv.slice(2);
// fetchClubInfo(myArgs[0])(myArgs[1])
//   .then(x => console.table([x.info]))
//   .catch(console.log)


  const ids = [
    "ritti34",
    "kjdadada"
  ]

Promise.all(map(fetchPlayerInfo("ps5"))(ids))
  .then(x => console.table(map(path(["info"]))(x)))
  .catch(e => console.log("error"));