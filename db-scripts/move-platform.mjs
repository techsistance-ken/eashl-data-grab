import { forEach } from "ramda";
import { firestore, getPlayerHistory } from "firestore-api/nhl23/index.js";
const PLATFORM = "ps5"
const PLAYER = "ritti34"




    const nhlCol = firestore.collection("nhl24");

    const docs = nhlCol.doc("ps5");

    const listDocs = nhlCol.get()
                        .then(snapshot => {
                            forEach(x => `${x.id} => ${x.data()}`)
                        })

    console.log("Hello")


    




    const path = `nhl24/${PLATFORM}/clubs`
//    firestore.collection(path).doc(playerGames[0].matchId).set(playerGames[0]);
    // const x = Promise.all(map(x => firestore.collection(path).doc(x.matchId).set(x))(playerGames))
    // x.then(vals => console.log(`Saved ${length(vals)} Games`)).catch(err => `Failed to save`)

    // const p = firestore.getAll()

    // console.log(p)
