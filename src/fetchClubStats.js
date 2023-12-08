// import { fetchClubStats } from "./eashl-api/index.js";

// const stats = fetchClubStats("common-gen5")("1620")

// stats.then(x => console.log(x))
// const headers = {
//     // "accept": "application/json",
//     // "referer": "https://www.ea.com",
//     // "origin": "https://www.ea.com",
//     "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36"
//   }

// fetch(`https://proclubs.ea.com/api/nhl/clubs/info?platform=common-gen5&clubIds=1620`,{headers: headers})
//   .then(x => x.text())
//   .then(x => console.log(x))
//   .catch(e => console.log(e))


const jsonFileEncoded = process.env.FIREBASE_ENC;
let bufferObj = Buffer.from(jsonFileEncoded, "base64");
// Encode the Buffer as a base64 string 
let jsonFileDecoded = JSON.parse(bufferObj.toString("utf8"));

console.log(jsonFileDecoded)
