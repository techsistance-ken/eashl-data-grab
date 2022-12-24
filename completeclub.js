import { fetchClubFinalsMatches, fetchClubInfo, fetchClubMembers, fetchClubStats, fetchPlayerInfo, fetchSeasonsMatches } from "./eashl-api/index.js";
import { slice, equals, always, cond, flatten, length, map, T, identity, compose, assoc, find, propEq, assocPath } from "ramda";
import * as fs from "fs"
import { saveAll } from "./firestore-api/nhl23/index.js";

const myArgs = process.argv.slice(2);

const platform = myArgs[0];
const clubId = myArgs[1];

const clientToPlatform = cond(
    [
        [equals("xbsx"), always("xbox-series-xs")],
        [equals("xone"), always("xboxone")],
        [T, identity]
    ]
)
const commonPlatform = cond(
    [
        [equals("ps5"),always("common-gen5")],
        [equals("xbox-series-x"),always("common-gen5")],
        [equals("xboxone"),always("common-gen4")],
        [equals("ps4"),always("common-gen4")],
        [T,always("common-gen5")],
    ]
)
// data
// clubId
// platForm
// info { }
// seasonStats { }
// seasonMatches [ ] 
// finalsMatches [ ] 
// memberStats [ ]
const buildInitialGrabs = data => {
    console.log("Grabbed Players")

    const ndx = data[0];
    const dataClubMembers = data[ndx.clubMembers];
    const dataFinalsMatches = data[ndx.finalsMatches];
    const dataSeasonMatches = data[ndx.seasonMatches];
    

    return Promise.all(flatten([
        new Promise(res => res({ 
            data: 0, 
            originalData: 1, 
            memberLength: 2, 
            seasonMatchesLength: 3,
            finalsMatchesLength: 4,
            arrayStart: 5,
        })),
        new Promise(res => res(data)), 
        new Promise(res => res(length(dataClubMembers.members))),
        new Promise(res => res(length(dataSeasonMatches.matches))),
        new Promise(res => res(length(dataFinalsMatches.matches))),
        map(x => fetchPlayerInfo(clientToPlatform(x.clientPlatform))(x.name))(dataClubMembers.members),
        map(x => fetchClubInfo(dataSeasonMatches.platform)(x.matchStats.oId))(dataSeasonMatches.matches),
        map(x => fetchClubInfo(dataFinalsMatches.platform)(x.matchStats.oId))(dataFinalsMatches.matches),
    ]))
}

const buildInitialPlusMatches = data => {

    const firstndx = data[1][0]
    const secondNdx = data[0];

    const originalData = data[secondNdx.originalData]
    
    const dataClubInfo = originalData[firstndx.clubInfo];
    const dataClubStats = originalData[firstndx.clubStats];
    const dataSeasonMatches = originalData[firstndx.seasonMatches];
    const dataFinalsMatches = originalData[firstndx.finalsMatches];
    const dataClubMembers = originalData[firstndx.clubMembers];

    const memberArrayStart = secondNdx.arrayStart;
    const memberLength = data[secondNdx.memberLength];
    const seasonMatchesLength = data[secondNdx.seasonMatchesLength];
    const finalsMatchesLength = data[secondNdx.finalsMatchesLength];
    const seasonMatchStart = memberArrayStart + memberLength;
    const finalsMatchStart = seasonMatchStart + seasonMatchesLength;


    const memberPlayerInfoArray = slice(memberArrayStart,memberArrayStart+memberLength)(data)
    const seasonMatchesArray = slice(seasonMatchStart,seasonMatchStart+seasonMatchesLength)(data)
    const finalsMatchesArray = slice(finalsMatchStart,finalsMatchStart+finalsMatchesLength)(data)

    const clubMemberList = dataClubMembers.members;
    const findById = name => find(propEq("id",name))
    const updatePlayerInfo = playerInfo => compose(
        assoc("gamesAtDefense",playerInfo.info.gamesAtDefense),
        assoc("gamesAtRightWing",playerInfo.info.gamesAtRightWing),
        assoc("gamesAtLeftWing",playerInfo.info.gamesAtLeftWing),
        assoc("gamesAtCenter",playerInfo.info.gamesAtCenter),
        assoc("playerName",playerInfo.info.playerName)
    )

    const updateMatchStatsWithClubName = clubName => compose(
        assocPath(["matchStats","oName"],clubName.info.name)
    )

    // x is one of the clubs members.
    // find it in the playerInfoArry
    const newMemberData = map(x =>  updatePlayerInfo(findById(x.name)(memberPlayerInfoArray))(x))(dataClubMembers.members);
    // loop through all matches, 
    // look at matchStats.oId
    const newSeasonData = map(x => updateMatchStatsWithClubName(findById(x.matchStats.oId)(seasonMatchesArray))(x))(dataSeasonMatches.matches);
    const newFinalsData = map(x => updateMatchStatsWithClubName(findById(x.matchStats.oId)(finalsMatchesArray))(x))(dataFinalsMatches.matches);


    const clubBasePlatform = dataClubMembers.members[0].clientPlatform;

    return {
       myClubInfo: dataClubInfo,
       myClubStats: dataClubStats.stats,
       myClubMembers: newMemberData,
       seasonMatches: newSeasonData,
       finalsMatches: newFinalsData,
       basePlatform: clubBasePlatform
    }
    
}

const writeJson = json => fs.writeFile("club.json",json,err => {
    if(err) console.log("err",err)
    console.log("Written")
})


Promise.all([
    new Promise(res => res({clubInfo: 1, clubStats: 2, seasonMatches: 3, finalsMatches: 4, clubMembers: 5})),
    fetchClubInfo(platform)(clubId),
    fetchClubStats(platform)(clubId),
    fetchSeasonsMatches(commonPlatform(platform))(clubId),
    fetchClubFinalsMatches(commonPlatform(platform))(clubId),
    fetchClubMembers(platform)(clubId)
])
.then(buildInitialGrabs)
.then(buildInitialPlusMatches)
.then(saveAll)
//.then(x => writeJson(JSON.stringify(x)))
.catch(e => console.log("err",e))
