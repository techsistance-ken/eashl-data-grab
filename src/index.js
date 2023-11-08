import { modify, compose, map, reduce, forEach, toLower } from 'ramda';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import fetch from "node-fetch";

const app = initializeApp(
  {
    credential: applicationDefault(),
    // databaseURL: "https://kjs-sports-gaming.firebaseio.com"
  }
);

const collection = "nhl24"
const stat_collection = "player-stats";
const playerClub = "playerclub"
const clubId = "1620"
const platform = "common-gen5"


// Data Transformation -- We want to turn these fields into number data types.
const numberStruct = [
  "wins",
  "losses",
  "otl",
  "assists",
  "goals",
  "points",
  "pointspg",
  "hattricks",
  "plusmin"
]

// First we build an array with the above fields, and make an array of functions that are 
// waiting for the object to modify.  
const numberModifiers = map(x => modify(x,Number))(numberStruct);

// Then we create a reducer that will take in the object and run each modifier on it one
// at a time. ex: R.reduce(modifyReducer,startingObject)(numberModifiers) 
const modifyReducer = (object, modifierFunction) => modifierFunction(object);

// Create a new client
const firestore = new Firestore();

  const headers = {
    "accept": "application/json",
    "referer": "https://www.a.com",
    "origin": "https://www.ea.com",
    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36"
  }

const setDoc = platform => clubId => name => gp => data => {
  const rootDocument = firestore.collection(collection).doc("player-stats").collection("by-platform").doc(platform).collection(clubId).doc(toLower(name)).collection(gp).doc(gp)
  const gpDocument = firestore.collection(collection).doc("player-stats").collection("by-platform").doc(platform).collection(clubId).doc(toLower(name));

  rootDocument.set(data)
  .then(x => console.log('Entered new data into the root document',x))
  .catch(e => console.log("Err",e))
  gpDocument.set(data)
  .then(x => console.log('Entered new data into the gp document',x))
  .catch(e => console.log("Err",e))
}

const modifyFields = x => reduce(numberModifiers, x);

const parseStats = (clubId,platform) => statsRaw => {
  const stats = 
  compose(
    x => map(member => reduce(modifyReducer,member)(numberModifiers))(x.members),
    x => JSON.parse(x)
  )(statsRaw);

  const ids = forEach(x => setDoc(platform)(clubId)(x.name)(x.gamesplayed)(x))(stats)
}

const makeFetch = (platform,clubId) => {
  fetch(`https://proclubs.ea.com/api/nhl/members/career/stats?platform=${platform}&clubId=${clubId}`,{headers: headers})
  .then(x => x.text())
  .then(parseStats(clubId,platform))
  .catch(e => console.log("e",e))

}
// Register a CloudEvent function with the Functions Framework
// functions.cloudEvent('eashl', cloudEvent => {
//   makeFetch(platform,clubId);
// });



// Register an HTTP function with the Functions Framework
// functions.http('clubSearch', async (req, res) => {
//   // Your code here
//   console.log(req.query)
//   // Send an HTTP response
//   const localheaders = {
//     "accept": "application/json",
//     "referer": "https://www.ea.com",
//     "origin": "https://www.ea.com",
//     "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
//     "X-Forwarded-For": "107.178.237.6"
//   }
//   const platform = req.query.platform
//   const searchTerm = req.query.club
//   console.log("localheaders",localheaders)
//   var num = -1
//   await fetch(`https://proclubs.ea.com/api/nhl/clubs/search?platform=${platform}&clubName=${searchTerm}`,{headers: localheaders})
//   //  await fetch(`https://techsistance.com/test1.php`,{headers: localheaders})
//   .then(x => x.text())
//   .then(x => {num = Object.keys(JSON.parse(x)).length })
//   // .then(x => console.log(x))
//   .catch(e => console.log("e",e))

//   res.send(`OK ${num}`);
// });


makeFetch(platform,process.argv.length == 3 ? process.argv[2] : clubId)

// const inquirer = require('inquirer');

// const questions = [
//   {
//     type: 'input',
//     name: 'name',
//     message: "Club Name",
//   },
// ];

// inquirer.prompt(questions).then(answers => {
//   console.log(`Hi ${answers.name}!`);
// });
