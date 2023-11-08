import { initializeApp, cert } from 'firebase-admin/app';
// import { Firestore, Timestamp, getFirestore } from '@google-cloud/firestore';
import { getFirestore } from "firebase-admin/firestore";
import { compose, map, tap, assoc, toLower, mergeAll, prop } from 'ramda';

const jsonFileEncoded = process.env.FIREBASE_ENC;
let bufferObj = Buffer.from(jsonFileEncoded, "base64");
// Encode the Buffer as a base64 string 
let jsonFileDecoded = JSON.parse(bufferObj.toString("utf8"));

console.log({
    projectId: prop("project_id")(jsonFileDecoded),
    privateKey: prop("private_key")(jsonFileDecoded).length,
    clientEmail: prop("client_email")(jsonFileDecoded)
})
const app = initializeApp(
  {
    // projectId: prop("project_id")(jsonFileDecoded),
    credential: cert({
        projectId: prop("project_id")(jsonFileDecoded),
        privateKey: prop("private_key")(jsonFileDecoded),
        clientEmail: prop("client_email")(jsonFileDecoded)
    }),
    // databaseURL: "https://kjs-sports-gaming.firebaseio.com"
  }
);

// Create a new client
// export const firestore = new Firestore();
export const firestore = getFirestore(app);


const nhlColl = firestore.collection("nhl24");

const platformDoc = platform => nhlColl.doc(platform)
const nhlPs5Doc = platformDoc("ps5");

export const playerColl = platform => platformDoc(platform).collection("players");
export const clubsColl = platform => platformDoc(platform).collection("clubs");



export const testDoc = () => nhlPs5Doc.set({foo: "bar"})
 .then(x => console.log("Set Ps5"))
 .catch(err => console.log("Error",err))

export const testDocPlayers = () => playerColl("ps5").doc("ken").set({name: "kjdadada"})

export const setClubStats = (platform,clubId) => clubStats => clubsColl(platform).doc(clubId).set(clubStats);

export const setPlayerStats = (platform, clubId) => playerStats => playerColl(platform).doc(toLower(playerStats.name)).set(playerStats);


const setClubMatch = matchType => (platform, clubId) => match => 
    clubsColl(platform).doc(clubId).collection(matchType).doc(match.matchId).set(match);

const setClubMatchPlayers = matchType => (platform, clubId) => matchId => player => 
    clubsColl(platform).doc(clubId).collection(matchType).doc(matchId).collection("players").doc(toLower(player.name)).set(compose(
        assoc("platform",platform),
        assoc("clubId",clubId),
        assoc("matchId",matchId),
        assoc("matchType",matchType),
    )(player));

const setPlayerHistory = matchType => (platform, clubId) => matchId => player => 
    playerColl(platform).doc(toLower(player.name)).collection("gameHistory").doc(matchId).set(compose(
        assoc("platform",platform),
        assoc("clubId",clubId),
        assoc("matchId",matchId),
        assoc("matchType",matchType),
    )(player));

const addMatchInfoToPlayerStats = (platform,clubId,matchType) => matchStats => compose(
        assoc("timestamp", matchStats.timestamp),
        assoc("result", matchStats.resultDesc),
        assoc("matchPath",`nhl24/${platform}/clubs/${clubId}/${matchType}/${matchStats.matchId}`),
        assoc("score",`${matchStats.goals}-${matchStats.ogoals}`),
        assoc("oName",matchStats.oName),
);

export const setClubSeasonMatch = setClubMatch("seasons");
export const setClubFinalsMatch = setClubMatch("finals");

export const setClubMatchAll = matchType => (platform, clubId) => compose(
  x => tap(y => 
             map(z => 
                setPlayerHistory(matchType)
                                (platform,clubId)
                                (y.matchStats.matchId)
                                (addMatchInfoToPlayerStats(platform,clubId,matchType)(y.matchStats)(z)))
                (y.playerStats),x),
  x => tap(y => map(setClubMatchPlayers(matchType)(platform,clubId)(y.matchStats.matchId))(y.playerStats),x),
  x => tap(y => setClubMatch(matchType)(platform,clubId)(y.matchStats),x),
)


const cTap = fn => tap(fn)
export const saveAll = compose(
    tap(club => setClubStats(club.basePlatform,club.myClubInfo.id)(mergeAll([club.myClubStats,club.myClubInfo.info]))),
    tap(club => map(setPlayerStats(club.basePlatform,club.myClubInfo.id))(club.myClubMembers)),
    tap(club => map(x => setClubMatchAll("seasons")(club.basePlatform,club.myClubInfo.id)(x))(club.seasonMatches)),
    tap(club => map(x => setClubMatchAll("finals")(club.basePlatform,club.myClubInfo.id)(x))(club.finalsMatches)),
)

// Deets
export const getPlayerHistory = platform => player => 
    playerColl(platform).doc(toLower(player)).collection("gameHistory").listDocuments();

