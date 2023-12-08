import { runCompleteClub } from "./completeclub.js";
const myArgs = process.argv.slice(2);

const platform = myArgs[0];
const clubId = myArgs[1];
runCompleteClub(platform,clubId);