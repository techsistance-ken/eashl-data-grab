import { testDocPlayers, testDoc, setClubStats, setPlayerStats, setClubSeasonMatch, setClubFinalsMatch, setClubMatchAll, saveAll } from './firestore-api/nhl23/index.js'
import inquirer from 'inquirer'
import { map, always, cond, equals, keys, T } from 'ramda';
import fs from 'fs';

//testDoc();
//testDocPlayers();

const ACTION_DOC = "Test Doc";
const ACTION_DOC_PLAYERS = "Test Doc Players";
const ACTION_LOAD_FILE_TEST = "Load File Test";
const ACTION_SAVE_CLUB_STATS = "Save Club Stats";
const ACTION_SAVE_CLUB_SEASONS = "Save Club Seasons";
const ACTION_SAVE_CLUB_FINALS = "Save Club Finals";
const ACTION_SAVE_PLAYER_STATS = "Save Player Stats";
const ACTION_SAVE_ALL = "Save All";

const ACTION_LIST =  [
    ACTION_DOC,
    ACTION_DOC_PLAYERS,
    ACTION_LOAD_FILE_TEST,
    ACTION_SAVE_CLUB_STATS,
    ACTION_SAVE_CLUB_SEASONS,
    ACTION_SAVE_CLUB_FINALS,
    ACTION_SAVE_PLAYER_STATS,
    ACTION_SAVE_ALL,
]

const loadJson = callBack => fs.readFile("club.json", "utf-8", (err, data) => {
  if(err) console.log(err);
  const d = JSON.parse(data);
  callBack(d);
})

const saveClubStats = club => setClubStats(club.basePlatform,club.myClubInfo.id)(club.myClubStats)
const savePlayerStats = club => map(setPlayerStats(club.basePlatform,club.myClubInfo.id))(club.myClubMembers)

const saveClubSeasonMatches = club => 
    map(x => 
        setClubMatchAll("seasons")(club.basePlatform,club.myClubInfo.id)(x)
        )(club.seasonMatches)


const saveClubFinalsMatches = club => map(x => setClubFinalsMatch(club.basePlatform,club.myClubInfo.id)(x.matchStats))(club.finalsMatches)

const runAction = cond(
    [
        [equals(ACTION_DOC), testDoc],
        [equals(ACTION_DOC), testDocPlayers],
        [equals(ACTION_LOAD_FILE_TEST), y => loadJson(x => console.log(keys(x)))],
        [equals(ACTION_SAVE_CLUB_STATS), () => loadJson(saveClubStats)],
        [equals(ACTION_SAVE_CLUB_SEASONS), () => loadJson(saveClubSeasonMatches)],
        [equals(ACTION_SAVE_CLUB_FINALS), () => loadJson(saveClubFinalsMatches)],
        [equals(ACTION_SAVE_PLAYER_STATS), () => loadJson(savePlayerStats)],
        [equals(ACTION_SAVE_ALL), () => loadJson(saveAll)],

        [T, always("No Action Found")]
    ]
)
inquirer
  .prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Action',
      choices: ACTION_LIST
    },
  ])
  .then(answers => {
    console.log("You Choose: ",answers.action)
    runAction(answers.action)
  })