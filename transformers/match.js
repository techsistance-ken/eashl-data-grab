import { keys, prop, cond, equals, always, T} from "ramda";

const getShots = prop("shots");
const getTeamSide = prop("teamSide");
const getGoals = prop("goals");
const getResult = prop("result");
const getTOA = prop("toa");
const getGameType = prop("cNhlOnlineGameType")
const getPassAttempts = prop("passa");
const getPassCompletions = prop("passc");

const convertResult = cond([
	[equals(1), always("Loss")],
	[equals(2), always("Win")],
	[equals(5), always("OT Win")],
	[equals(6), always("OTL")],
	[equals(10), always("DNF Loss")],
	[equals(16385), always("DNF Win")],
	[T, val => `Unknown "${val}"`]
]
)

const convertGameType = cond([
	[equals(206), always("Club Finals")],
	[equals(200), always("Online Season")],
	[T, val => `Unknown "${val}"`]
]
)

function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

const getPassPct = (total, completed) => total == 0 ? "0%" : `${100*roundToTwo(completed / total)}%`;

export const getPlayersSummary = clubId => matchData => {
	const clubStats = prop("clubs")(matchData);
	const aggregateStats = prop("aggregate")(matchData);

	const clubs = keys(clubStats)
	const oClubId = clubs[0] == clubId ? clubs[1] : clubs[0];

	const myClubStats = prop(clubId)(clubStats);
	const oClubStats = prop(oClubId)(clubStats);

	const myAggStats = prop(clubId)(aggregateStats);
	const oAggStats = prop(oClubId)

	const passAttempts = getPassAttempts(myClubStats);
	const passCompletions = getPassCompletions(myClubStats);
    const passPct = getPassPct(passAttempts, passCompletions);	

	const oPassAttempts = getPassAttempts(oClubStats);
	const oPassCompletions = getPassCompletions(oClubStats);
    const oPassPct = getPassPct(oPassAttempts, oPassCompletions);	

	return {
		home: getTeamSide(myClubStats) == 0,
		shots: Number(getShots(myClubStats)),
		oshots: Number(getShots(oClubStats)),
		goals: Number(getGoals(myClubStats)),
		ogoals: Number(getGoals(oClubStats)),
		toa: Number(getTOA(myClubStats)),
		otoa: Number(getTOA(oClubStats)),
		oId: oClubId,
		result: Number(getResult(myClubStats)),
		resultDesc: convertResult(Number(getResult(myClubStats))),
		gameType: Number(getGameType(myClubStats)),
		gameTypeDesc: convertGameType(Number(getGameType(myClubStats))),
		passPct: passPct,
		opassPct: oPassPct,
	}
}





