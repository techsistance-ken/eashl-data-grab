import { T, always, equals, without, identity, map, keys, reduce, assoc, prop, compose, cond } from "ramda";

const strBool = compose(Boolean,Number);

const dataConversion = {
    "class": {f: "class", c: identity},
    "clientPlatform": {f: "system", c: identity},
    "playerlevel": {f: "level", c: Number},
    "player_dnf": {f: "dnf", c: strBool },
    "playername": {f: "name", c: identity },
    "position": {f: "position", c: identity},
    "rankpoints": {f: "rank", c: cond([[equals("--"), always(0)],[T, Number]])},
    "ratingDefense": {f: "ratingDefense", c: Number},
    "ratingOffense": {f: "ratingOffense", c: Number},
    "ratingTeamPlay": {f: "ratingTeamPlay", c: Number},
    "removedReason": {f: "removedCode", c: Number},
    "skassists": {f: "assists", c: Number},
    "skbs": {f: "blockedShots", c: Number},
    "skdeflections": {f: "defelections", c: Number},
    "skfol": {f: "faceoffsLost", c: Number},
    "skfopct": {f: "faceoffPct", c: Number},
    "skfow": {f: "faceoffsWon", c: Number},
    "skgiveaways": {f: "giveaways", c: Number},
    "skgoals": {f: "goals", c: Number},
    "skgwg": {f: "gameWinningGoal", c: strBool },
    "skhits": {f: "hits", c: Number},
    "skinterceptions": {f: "interceptions", c: Number},
    "skpassattempts": {f: "passAttempts", c: Number},
    "skpasses": {f: "passesCompleted", c: Number},
    "skpasspct": {f: "passPct", c: Number},
    "skpenaltiesdrawn": {f: "penaltiesDrawn", c: Number},
    "skpim": {f: "penaltyMinutes", c: Number},
    "skpkclearzome": {f: "clearZone", c: Number},
    "skplusmin": {f: "plusMinus", c: Number},
    "skppg": {f: "powerplayGoals", c: Number},
    "sksaucerpasses": {f: "saucerPasses", c: Number},
    "skshg": {f: "shorthandedGoals", c: Number},
    "skshotattempts": {f: "shotAttempts", c: Number},
    "skshotonnetpct": {f: "shotOnNetPct", c: Number},
    "skshotpct": {f: "shotPct", c: Number},
    "skshots": {f: "shots", c: Number},
    "sktakeaways": {f: "takeaways", c: Number},
    "toi": {f: "timeOnIce", c: Number},
    "toiseconds": {f: "SecondsOnIce", c: Number},
}

const conv = glass => fld => prop(fld)(glass) == null ? undefined : assoc("o",fld)(prop(fld)(glass))

export const matchPlayerStats = stats => {
    const flds = without([undefined],map(conv(dataConversion))(keys(stats)))
    return reduce((acc,elem) => assoc(elem.f,elem.c(prop(elem.o)(stats)))(acc),{})(flds)

}
