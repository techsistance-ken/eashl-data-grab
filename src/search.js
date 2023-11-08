import fetch from 'node-fetch';
import { length, find, propEq, mergeAll, prop, values, forEach, modify, compose, reduce, map, toLower } from 'ramda';
import { minimalMemberStats } from './transformers/members.js';
// var admin = require("firebase-admin");
import { initializeApp, cert} from 'firebase-admin/app';
import { Firestore } from '@google-cloud/firestore';
import { fetchClubFinalsMatches, fetchSeasonsMatches, fetchClubMembers, fetchClubStats, searchClubinNewGen } from './eashl-api/index.js'
import inquirer from 'inquirer'


const jsonFileEncoded = process.env.FIREBASE_ENC;
let bufferObj = Buffer.from(jsonFileEncoded, "base64");
// Encode the Buffer as a base64 string 
let jsonFileDecoded = JSON.parse(bufferObj.toString("utf8"));


const app = initializeApp(
  {
    credential: cert({

    }),
    // databaseURL: "https://kjs-sports-gaming.firebaseio.com"
  }
);

const collection = "nhl23"
const stat_collection = "player-stats";
const playerClub = "playerclub"
const clubId = "13156"
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
const parseStats = statsRaw => {
  const stats = 
  compose(
    values,
    x => JSON.parse(x)
  )(statsRaw);

  forEach(x => console.log(x.clubId + " " + x.name + " " + x.record))(stats)
}

const makeFetch = (searchTerm) => {

  fetch(`https://proclubs.ea.com/api/nhl/clubs/search?platform=common-gen5&clubName=${searchTerm}`,{headers: headers})
  .then(x => x.text())
  .then(parseStats)
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


const nextStep = (platform,clubId) => {
    return fetchClubMembers(platform)(clubId);
}
const nextStep2 = (platform,clubId) => {
    return fetchClubStats(platform)(clubId);
}

const pickTeam = teams => {
  console.table(teams)
  if(length(teams) == 0) {console.log("No Teams Found"); return null}
  else if(length(teams) == 1) return nextStep(teams[0].platform,teams[0].id);
  else 
  return inquirer
  .prompt([
    {
      type: 'list',
      name: 'club',
      message: 'What club?',
      choices: map(prop("clubName"))(teams)
    },
  ])
  .then(answers => {
    const c = find(propEq("clubName",answers.club))(teams);
    return nextStep(c.platform,c.id);
  })
}
const myArgs = process.argv.slice(2);
searchClubinNewGen(myArgs[0])
  .then(pickTeam)
  .then(x => x == null ? nextStep2(x.platform,x.id) : (console.table(map(minimalMemberStats)(x.members)), nextStep2(x.platform,x.id)))
  .then(x => (console.table([x.stats]),fetchSeasonsMatches(x.platform)(x.id)))
  .then(x => (console.table(map(y => y.matchStats)(x.matches)),fetchClubFinalsMatches(x.platform)(x.id)))
  .then(x => console.table(map(y => y.matchStats)(x.matches)))
  .catch(console.log)


// makeFetch(platform,clubId)

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
