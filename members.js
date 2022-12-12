import { fetchClubMembers } from "./eashl-api/index.js"
import { minimalMemberStats } from "./transformers/members.js";
import { mergeAll, map } from "ramda";

const myArgs = process.argv.slice(2);
fetchClubMembers(myArgs[0])(myArgs[1])
  .then(x => console.table(mergeAll(map(minimalMemberStats)(x))))
  .catch(console.log)
