import { assoc } from "ramda";
export const minimalMemberStats = eaMemberData => {


    const data = assoc(eaMemberData.name, {
            record: eaMemberData.record,
            plusMinus: eaMemberData.plusmin,
            breakawayPct: eaMemberData.breakawaypct,
            name: eaMemberData.name,
            hattricks: eaMemberData.hattricks,
            faceoffPct: eaMemberData.fop,
            hitsPerGame: eaMemberData.skhitspg,
    })({});

    return data;
}