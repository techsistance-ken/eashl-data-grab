import { modifyListOfFields } from "./modifymultiple";

const obj = {
    wins: "23",
    losses: "10",
    foo: "bar",
    position: "leftWing",
    person: { first: "john", last: "doe" },
}

const numberStruct = [
    "wins",
    "losses",
    "ken"
  ]
  

test("Modifier", () => {
    expect(modifyListOfFields(Number)(obj,numberStruct)).toStrictEqual(
        {
            wins: 23,
            losses: 10,
            foo: "bar",
            position: "leftWing",
            person: { first: "john", last: "doe" },
        }
    )
})
