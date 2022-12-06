// eashl-api
// import { searchClub } from "./search"
import { identity, map, compose, values, forEach } from "ramda"
import { clubSeasonStats } from "../transformers/clubstats.js"
import { modifyListOfFields } from "../utils/modifiers/modifymultiple.js"

const baseUrl = "https://proclubs.ea.com/api/nhl/"

const clubSearch = "clubs/search"

const headers = {
    "accept": "application/json",
    "referer": "https://www.a.com",
    "origin": "https://www.ea.com",
    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36"
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


const searchClub = platform => searchTerm => {
  // searchClubs
  return fetch(`https://proclubs.ea.com/api/nhl/clubs/search?platform=${platform}&clubName=${searchTerm}`,{headers: headers})
  .then(x => x.text())
  .then(parseSearch(platform))
  .catch(identity)
}

export const searchClubinNewGen = searchClub("common-gen5")


export const getClubMembers = platform => clubId => {
  return fetch(`https://proclubs.ea.com/api/nhl/members/career/stats?platform=${platform}&clubId=${clubId}`,{headers: headers})
  .then(x => x.text())
  .then(parseStats(clubId,platform))
  .catch(e => console.log("e",e))

}

export const getClubStats = platform => clubId => {
  return fetch(`https://proclubs.ea.com/api/nhl/clubs/seasonalStats?platform=${platform}&clubIds=${clubId}`,{headers: headers})
  .then(x => x.text())
  .then(parseSeasonalStats(clubId,platform))
  .catch(e => console.log("e",e))

}