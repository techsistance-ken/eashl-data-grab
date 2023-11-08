import { prop, assoc, length, map, reduce, values, compose } from "ramda";
import fs from "fs"
import { firestore, getPlayerHistory } from "../firestore-api/nhl23/index.js";

const PLAYER_NAME = "kjdadada";
const c = getPlayerHistory("ps5")(PLAYER_NAME);


console.log(c);