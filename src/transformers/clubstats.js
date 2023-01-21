import { without, identity, map, keys, reduce, assoc, prop } from "ramda";

const dataConversion = {
    "seasons": {f: "seasons", c: Number},
    "currentDivision": {f: "currentDivision", c: Number},
    "promotions": {f: "promotions", c: Number},
    "relegations": {f: "relegations", c: Number},
    "holds": {f: "holds", c: Number},
    "record": {f: "record", c: identity},
    "titlesWon": {f: "titles", c: Number},
    "goals": {f: "goalsAgainst", c: Number},
    "goalsAgainst": {f: "goalsAgainst", c: Number},
}

const conv = glass => fld => prop(fld)(glass) == null ? undefined : assoc("o",fld)(prop(fld)(glass))

export const clubSeasonStats = statsArr => {
    const stats = statsArr[0];
    const flds = without([undefined],map(conv(dataConversion))(keys(stats)))
    return reduce((acc,elem) => assoc(elem.f,elem.c(prop(elem.o)(stats)))(acc),{})(flds)

}
