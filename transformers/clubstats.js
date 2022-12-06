import { assoc, prop } from "ramda";

const getSeasons = prop("seasons");
const getCurrentDivision = prop("currentDivision");
const getPromotions = prop("promotions");
const getRelegations = prop("relegations");
const getHolds = prop("holds");
const getRecord = prop("record")
const getTitles = prop("titlesWon");
const getGoals = prop("goals");
const getGoalsAgainst = prop("goalsAgainst");

export const clubSeasonStats = statsArr => {
    const stats = statsArr[0];
    return {
        seasons: Number(getSeasons(stats)),
        currentDivision: Number(getCurrentDivision(stats)),
        promotions: Number(getPromotions(stats)),
        relegations: Number(getRelegations(stats)),
        holds: Number(getHolds(stats)),
        record: getRecord(stats),
        titles: Number(getTitles(stats)),
        goals: Number(getGoals(stats)),
        goalsAgainst: Number(getGoalsAgainst(stats)),
    };
}
