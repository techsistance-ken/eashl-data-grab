import express from "express"
import { prop, always, any, includes, ifElse, isNil, length,path, not  } from "ramda";
import { searchClub, searchClubinNewGen } from "./eashl-api/index.js";

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    const name = process.env.NAME || 'World';
    res.send(`Hello ${name}!`);
  });

app.post("/search", (req, res) => {

  const term = prop("searchTerm",req.body);
  const platform = prop("platform",req.body);

  const termSuccess = ifElse(
     x => not((isNil(x) || length(x) < 3)),
     always({s: true, m: ""}),
     always({s: false, m: "searchTerm must be supplied and be 3 chars or longer"}),
  )(term);



  const platformSuccess = ifElse(
    x => includes(x, ["common-gen5","common-gen4"]),
    always({s: true, m: ""}),
    always({s: false, m: "platform must be common-gen4 or common-gen5"})
  )(platform)


  if(any(x=>x.s==false)([termSuccess,platformSuccess])) {
    res.status(400);
    res.send(`Required Term: ${termSuccess.s ? "OK" : termSuccess.m}, Required Platform: ${platformSuccess.s ? "OK" : platformSuccess.m}`)
    return;
  }

  searchClub(platform)(term)
    .then(x => res.send(x))
    .catch(e => { res.status(400); res.send("");})

})
  
  const port = parseInt(process.env.PORT) || 8080;
  app.listen(port, () => {
    console.log(`helloworld: listening on port ${port}`);
  });