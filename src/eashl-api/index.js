// eashl-api
// import { searchClub } from "./search"
import { identity, map, compose, values, forEach } from "ramda"
import { clubSeasonStats } from "../transformers/clubstats.js"
import { getPlayersSummary } from "../transformers/match.js"
import { clubInfo } from "../transformers/clubinfo.js"
import { modifyListOfFields } from "../utils/modifiers/modifymultiple.js"
import { playerInfo } from "../transformers/playerInfo.js"
import fetch from "node-fetch"

const baseUrl = "https://proclubs.ea.com/api/nhl/"

const clubSearch = "clubs/search"

const headers = {
    "accept": "application/json",
    "referer": "https://www.a.com",
    "origin": "https://www.ea.com",
    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36"
  }

  const parsePlayerInfo = (playerId, platform) => statsRaw => {
     return playerInfo(playerId)(JSON.parse(statsRaw));
  }
  const parseInfo = (clubId, platform) => statsRaw => {
    const stats = 
    compose(
      // x => map(member => reduce(modifyReducer,member)(numberModifiers))(x.members),
      x => JSON.parse(x)
    )(statsRaw);

    return clubInfo(clubId)(stats)
  }
  const parseMatches = (clubId, platform) => statsRaw => {
    const stats = 
    compose(
      // x => map(member => reduce(modifyReducer,member)(numberModifiers))(x.members),
      x => JSON.parse(x)
    )(statsRaw);

    return map(getPlayersSummary(clubId))(stats)
  }
  const parseSearch = platform => statsRaw => {
    const stats = 
    compose(
      values,
      x => JSON.parse(x)
    )(statsRaw);

    return map(x => ({platform: platform, id: x.clubId, 
      clubName: x.name, record: x.record}))(stats)
  }

  const parseStats = (clubId,platform) => statsRaw => {
    const stats = 
    compose(
      // x => map(member => reduce(modifyReducer,member)(numberModifiers))(x.members),
      x => JSON.parse(x)
    )(statsRaw);
    return { platform, id: clubId, members: stats.members };
  }

  const parseSeasonalStats = (clubId,platform) => statsRaw => {
    const stats = 
    compose(
      // x => map(member => reduce(modifyReducer,member)(numberModifiers))(x.members),
      x => JSON.parse(x)
    )(statsRaw);


    return clubSeasonStats(stats)
  }


export const fetchPlayerInfo = platform => playerId => {
  return fetch(`https://proclubs.ea.com/api/nhl/members/search?platform=${platform}&memberName=${playerId}`,{headers: headers})
  .then(x => x.text())
  .then(x => ({ platform, id: playerId, info: parsePlayerInfo(playerId,platform)(x), success: true}))
  .catch(e => console.log(e))
}

export const fetchClubInfo = platform => clubId => {
  return fetch(`https://proclubs.ea.com/api/nhl/clubs/info?platform=${platform}&clubIds=${clubId}`,{headers: headers})
  .then(x => x.text())
  .then(x => ({ platform, id: clubId, info: parseInfo(clubId,platform)(x), success: true}))
  .catch(e => console.log(e))
}

export const searchClub = platform => searchTerm => {
  // searchClubs
  return fetch(`https://proclubs.ea.com/api/nhl/clubs/search?platform=${platform}&clubName=${searchTerm}`,{headers: headers})
  .then(x => x.text())
  .then(parseSearch(platform))
  .catch(identity)
}

export const searchClubinNewGen = searchClub("common-gen5")


export const fetchClubMembers = platform => clubId => {
  return fetch(`https://proclubs.ea.com/api/nhl/members/career/stats?platform=${platform}&clubId=${clubId}`,{headers: headers})
  .then(x => x.text())
  .then(parseStats(clubId,platform) )
  .catch(e => console.log("e",e))

}

export const fetchClubStats = platform => clubId => {
  return fetch(`https://proclubs.ea.com/api/nhl/clubs/seasonalStats?platform=${platform}&clubIds=${clubId}`,{headers: headers})
  .then(x => x.text())
  .then(x => ({ platform, id: clubId, success: true, stats: parseSeasonalStats(clubId,platform)(x)}))
  .catch(e => ({ platform, id: clubId, stats: null, success: false, error: e }))
}

const fetchClubMatches = gameType => platform => clubId => {
  return fetch(`https://proclubs.ea.com/api/nhl/clubs/matches?matchType=${gameType}&platform=${platform}&clubIds=${clubId}`,{headers: headers})
  .then(x => x.text())
  .then(x => ({platform, id: clubId, matches: parseMatches(clubId,platform)(x)}))
  .catch(e => ({platform, id: clubId, matches: null, error: e}))
}


export const fetchClubFinalsMatches = fetchClubMatches("gameType10")
export const fetchSeasonsMatches = fetchClubMatches("gameType5")


