import { prop, assoc, length, map, reduce, values, compose } from "ramda";
import fs from "fs"
import { firestore, getPlayerHistory } from "../firestore-api/nhl23/index.js";

const PLAYER_NAME = "kjdadada";
const c = getPlayerHistory("ps5")(PLAYER_NAME);
const m = (games, game) => {
    const playerGame = prop(game.matchId)(games);
    console.log("pg",games)
    const newData = compose(
        assoc("timestamp", game.timestamp),
        assoc("result", game.resultDesc),
        assoc("score",`${game.goals}-${game.ogoals}`),
        assoc("oName",game.oName),
    )(playerGame)

    return newData

}
c.then(docRefs => firestore.getAll(...docRefs))
.then(docSnapshots => {
    let games = [] 
    for (let documentSnapshot of docSnapshots) {
        if (documentSnapshot.exists) {
          let data = documentSnapshot.data();
          games.push(data)
        } else {
          console.log(`Found missing document: ${documentSnapshot.id}`);
        }
    }

    console.log(length(games))

    const dataAsMap1 = reduce((acc, elem) => assoc(elem.matchId,elem)(acc), {})(games)

    const dataAsMap2 = map(x => assoc("matchPath",`nhl23/ps5/clubs/${x.clubId}/${x.matchType}/${x.matchId}`)(x))(dataAsMap1)

//    console.log(map(prop("matchPath"))(values(dataAsMap2)))

    const allMatchesPromises = Promise.all(map(x => firestore.doc(prop("matchPath")(x)).get())(values(dataAsMap2)))
    console.log(allMatchesPromises)

    allMatchesPromises.then(matchSnapshots => {
        const matchData = map(x => x.exists ? m(dataAsMap2,x.data()) : x)(matchSnapshots)
        
        fs.writeFile(`${PLAYER_NAME}.json`,JSON.stringify(matchData),err => {
            if(err) console.log("e",err)

            console.log("Written")
        })

        console.log(matchData[12])

    }).catch(e => console.log("e2",e))




})
.catch(e => console.log("e",e))
