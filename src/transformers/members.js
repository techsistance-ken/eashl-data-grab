import { keys, reduce, without, prop, assoc, identity, map } from "ramda";
const dataConversion = {
    "plusmin": {f: "plusMinus", c: Number},
    "breakawaypct": {f: "breakawayPct", c: Number},
    "hattricks": {f: "hatTricks", c: Number},
    "fop": {f: "faceoffPct", c: Number},
    "favoritePosition": {f: "position", c: identity},
    "skhitspg": {f: "hitsPerGame", c: Number},
    "record": {f: "record", c: identity},
    "goals": {f: "goals", c: Number},
    "assists": {f: "assists", c: Number},
    "hits": {f: "hits", c: Number},
    "penaltyattempts": {f: "penaltyShots", c: Number},
    "penaltyshotgoals": {f: "penaltyGoals", c: Number},
    "name": {f: "name", c: identity},
    "clientPlatform": {f: "clientPlatform", c: identity},
}

const conv = glass => fld => prop(fld)(glass) == null ? undefined : assoc("o",fld)(prop(fld)(glass))

export const minimalMemberStats = eaMemberData => {
    const flds = without([undefined],map(conv(dataConversion))(keys(eaMemberData)))
    const returnData = reduce((acc,elem) => assoc(elem.f,elem.c(prop(elem.o)(eaMemberData)))(acc),{})(flds)
    return assoc("raw",eaMemberData)(returnData)
}