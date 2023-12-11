const fs = require("fs");

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d9.txt", {
        encoding: "utf-8"
    });
    return fileBuffer
        .trim()
        .split("\r\n")
        .map((line) => line.trim().split(" ").map(Number));
}

function getSum(sequence) {
    return sequence.reduce((acc, curr) => acc + curr, 0);
}

function getDifferences(sequence) {
    return sequence.slice(1).map((number, i) => number - sequence[i]);
}

function getDiffHistory(sequence) {
    const diffHistory = [sequence];
    let nextDiff = getDifferences(sequence);

    while (nextDiff.some((diff) => diff !== 0)) {
        diffHistory.push(nextDiff);
        nextDiff = getDifferences(nextDiff);
    }
    return diffHistory;
}

function extrapolate(diffHistory, findPrevious = false) {
    for (let j = diffHistory.length - 2; j >= 0; j--) {
        findPrevious ? addPreviousElement(diffHistory, j) : addNextElement(diffHistory, j);
    }
    return findPrevious ? diffHistory[0][0] : diffHistory[0].pop();
}

function addNextElement(diffHistory, i) {
    diffHistory[i].push(diffHistory[i].pop() + diffHistory[i + 1].pop());
}
function addPreviousElement(diffHistory, i) {
    diffHistory[i].unshift(diffHistory[i].shift() - diffHistory[i + 1].shift());
}

function calculatePart1() {
    const input = readValuesFromFile();
    const nextValues = input.map((sequence) => extrapolate(getDiffHistory(sequence)));
    return getSum(nextValues);
}

function calculatePart2() {
    const input = readValuesFromFile();
    const previousValues = input.map((sequence) => extrapolate(getDiffHistory(sequence), true));
    return getSum(previousValues);
}

console.time("execution time");
const part1Result = calculatePart1();
const part2Result = calculatePart2();
console.timeEnd("execution time");
console.log("part 1:", part1Result); // 1641934234
console.log("part 2:", part2Result); // 975
// 14.633ms
