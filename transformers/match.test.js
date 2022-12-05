import { getPlayersSummary } from "./match.js";
import { readFile } from "fs";

let sample_matches = [] 
let sample_match_raw = ""

const finalObj = {
	home: true,
	shots: 16,
	oshots: 22,
	goals: 3,
	ogoals: 4,
	result: 6,
	resultDesc: "OTL",
	toa: 702,
	otoa: 524,
	oId: "15525",
	gameType: 206,
	gameTypeDesc: "Club Finals",
	passPct: "75%",
	opassPct: "80%"
}
describe("Player Match Transformations", () => {
	beforeEach(() => {
		return new Promise(resolve => {
			readFile('./transformers/test-data/sample-match-data.txt', 'utf8', function(err, data){
				sample_match_raw = data;
				sample_matches = JSON.parse(sample_match_raw);
				resolve();
			})
		});
	});

	


	test("Match Summary is 1", () => {
		const firstMatch = sample_matches[0]
		expect(getPlayersSummary(13156)(firstMatch)).toStrictEqual(finalObj);
	})
});
