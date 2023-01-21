const R = require("ramda")

const s = { assists: "10", goals: "3" };

console.log(s)
console.log(R.modify("assists",Number)(s))

const b = [R.modify("assists",Number), R.modify("goals",Number)];


const newS = R.reduce((acc, elem) => elem(acc), s)(b)

console.log(`NewS is ${JSON.stringify(newS)}`)