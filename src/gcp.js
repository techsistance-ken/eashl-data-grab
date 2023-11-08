import fetch from "node-fetch";
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

fetch("http://34.122.21.46:8080/search",{  "body": JSON.stringify({"searchTerm":"respect the in", "platform":"common-gen5"}), "headers": { "content-type": "application/json" }, "method": "POST"})
  .then(x => { console.log(x.statusText); return x.json()})
  .then(x => console.log(`Good ${JSON.stringify(x)}`))
  .catch(e => console.log(`Error ${e}`))