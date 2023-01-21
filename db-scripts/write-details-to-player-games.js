import fs from "fs"
import { length, map } from "ramda";
import { firestore, getPlayerHistory } from "../firestore-api/nhl23/index.js";

const PLATFORM = "ps5"
const PLAYER = "ritti34"



fs.readFile(`${PLAYER}.json`,(err, data) => {
    if (err) console.log("err",err);

    const playerGames = JSON.parse(data);

    const path = `nhl23/${PLATFORM}/players/${PLAYER}/gameHistory`
//    firestore.collection(path).doc(playerGames[0].matchId).set(playerGames[0]);
    const x = Promise.all(map(x => firestore.collection(path).doc(x.matchId).set(x))(playerGames))
    x.then(vals => console.log(`Saved ${length(vals)} Games`)).catch(err => `Failed to save`)
})

