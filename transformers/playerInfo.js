import { prop, propEq, find, toLower, propSatisfies } from "ramda";

export const playerInfo = playerName =>  infoMap => {
    const info = find(propSatisfies(x => toLower(x) == toLower(playerName), "name"))(prop("members",infoMap))

    return {
        name: prop("name")(info),
        gamesAtCenter: Number(prop("cgp")(info)),
        gamesAtLeftWing: Number(prop("lwgp")(info)),
        gamesAtRightWing: Number(prop("rwgp")(info)),
        gamesAtDefense: Number(prop("dgp")(info)),
        playerName: prop("skplayername")(info),
        favoritePosition: prop("favoritePosition")(info),
    }
}