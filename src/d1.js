const fs = require("fs");

function readValuesFromFile() {
  const fileBuffer = fs.readFileSync("../inputs/d1.txt", { encoding: "utf-8" });
  return fileBuffer.split("\n").map((v) => v.replace(/\r/, ""));
}

function sumOfFirstAndLastNumbers(numericValues) {
  return numericValues
    .map((v) => +(v[0] + v.slice(-1)))
    .reduce((acc, curr) => acc + curr);
}

function toNumber(string) {
  const numbersAsStrings = {
    zero: "0",
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
  };
  return Object.keys(numbersAsStrings).includes(string)
    ? numbersAsStrings[string]
    : string;
}

function parseNumbersInString(string) {
  const regex = /(?=(\d|zero|one|two|three|four|five|six|seven|eight|nine))/g;
  return [...string.matchAll(regex)].map((m) => toNumber(m[1]));
}

// -------------- part 1 ---------------
const lines = readValuesFromFile();
const linesWithNumbers = lines.map((v) => v.replace(/\D/g, ""));
console.log("part 1: ", sumOfFirstAndLastNumbers(linesWithNumbers));

// -------------- part 2 ---------------
const linesWithNumbers2 = lines.map((line) => parseNumbersInString(line));
console.log("part 2: ", sumOfFirstAndLastNumbers(linesWithNumbers2));
