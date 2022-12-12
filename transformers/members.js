import { keys, reduce, without, prop, assoc, identity, map } from "ramda";
const dataConversion = {
    "plusmin": {f: "plusMinus", c: Number},
    "breakawaypct": {f: "breakawayPct", c: Number},
    "hattricks": {f: "hatTricks", c: Number},
    "fop": {f: "faceoffPct", c: Number},
    "favoritePosition": {f: "position", c: identity},
    "skhitspg": {f: "hitsPerGame", c: Number},
    "record": {f: "record", c: identity},
    "name": {f: "name", c: identity}
}

const conv = glass => fld => prop(fld)(glass) == null ? undefined : assoc("o",fld)(prop(fld)(glass))

export const minimalMemberStats = eaMemberData => {
    const flds = without([undefined],map(conv(dataConversion))(keys(eaMemberData)))
    return reduce((acc,elem) => assoc(elem.f,elem.c(prop(elem.o)(eaMemberData)))(acc),{})(flds)
}