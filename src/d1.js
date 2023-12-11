const fs = require("fs");
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
    nine: "9"
};

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d1.txt", {
        encoding: "utf-8"
    });
    return fileBuffer.split("\n").map((v) => v.replace(/\r/, ""));
}

function sumOfFirstAndLastNumbers(numericValues) {
    return numericValues.reduce((acc, curr) => acc + Number(curr[0] + curr.slice(-1)), 0);
}

function parseNumbersInString(string) {
    const regex = /(?=(\d|zero|one|two|three|four|five|six|seven|eight|nine))/g;
    return [...string.matchAll(regex)].map((m) => numbersAsStrings[m[1]] || m[1]);
}

function calculateDay1() {
    const lines = readValuesFromFile();
    const linesWithNumbers = lines.map((v) => v.replace(/\D/g, ""));
    const linesWithNumbers2 = lines.map(parseNumbersInString);
    const part1Result = sumOfFirstAndLastNumbers(linesWithNumbers);
    const part2Result = sumOfFirstAndLastNumbers(linesWithNumbers2);
    return { part1Result, part2Result };
}

console.time("execution time");
const { part1Result, part2Result } = calculateDay1();
console.timeEnd("execution time");
console.log("part 1:", part1Result); // 56506
console.log("part 2:", part2Result); // 56017
// 4.411ms
