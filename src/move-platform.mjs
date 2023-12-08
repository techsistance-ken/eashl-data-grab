import { forEach, map } from "ramda";
import { firestore, getPlayerHistory } from "../src/firestore-api/nhl23/index.js";
const PLATFORM = "ps5"
const PLAYER = "ritti34"




    const ps5SeasonsDoc = firestore.collection("nhl24/ps5/clubs/1620/seasons");
    const common5SeasonsDoc = firestore.collection("nhl24/common-gen5/clubs/1620/seasons");

    const docs = ps5SeasonsDoc.doc("ps5");

    const listDocs = ps5SeasonsDoc.listDocuments();

    listDocs.then(x => {

            const allDocs = Promise.all(map(ddd => ddd.get())(x))
              .then(all => {

                
                forEach(single => {
                    console.log(`${common5SeasonsDoc.path}/${single.id} => ${single.data().result}`)
                    firestore.doc(`${common5SeasonsDoc.path}/${single.id}`).set(single.data())
                })(all)
              })
        

    })

    




    const path = `nhl24/${PLATFORM}/clubs`
//    firestore.collection(path).doc(playerGames[0].matchId).set(playerGames[0]);
    // const x = Promise.all(map(x => firestore.collection(path).doc(x.matchId).set(x))(playerGames))
    // x.then(vals => console.log(`Saved ${length(vals)} Games`)).catch(err => `Failed to save`)

    // const p = firestore.getAll()

    // console.log(p)
