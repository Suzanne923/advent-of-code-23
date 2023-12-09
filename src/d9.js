const fs = require("fs");

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d9.txt", {
        encoding: "utf-8"
    });
    return fileBuffer.trim().split("\r\n");
}

function getDifferences(sequence) {
    const differences = [];
    for (let i = 1; i < sequence.length; i++) {
        differences.push(sequence[i] - sequence[i - 1]);
    }
    return differences;
}

function getSum(sequence) {
    return sequence.reduce((acc, curr) => acc + curr);
}

function getDiffHistory(input, i) {
    const sequence = input[i].trim().split(" ").map(Number);
    const diffHistory = [sequence];
    let nextDiff = getDifferences(sequence);

    while (nextDiff.some(diff => diff !== 0)) {
        diffHistory.push(nextDiff);
        nextDiff = getDifferences(nextDiff);
    }
    return diffHistory;
}

function calculatePart1() {
    const input = readValuesFromFile();
    const nextValues = [];

    for (let i = 0; i < input.length; i++) {
        const diffHistory = getDiffHistory(input, i);

        for (let j = diffHistory.length - 2; j >= 0; j--) {
            const currSequence = diffHistory[j];
            diffHistory[j].push(currSequence.pop() + diffHistory[j + 1].pop());
        }
        nextValues.push(diffHistory[0].pop());
    }
    return getSum(nextValues);
}

function calculatePart2() {
    const input = readValuesFromFile();
    const previousValues = [];

    for (let i = 0; i < input.length; i++) {
        const diffHistory = getDiffHistory(input, i);

        for (let j = diffHistory.length - 2; j >= 0; j--) {
            const currSequence = diffHistory[j];
            diffHistory[j].unshift(currSequence.shift() - diffHistory[j + 1].shift());
        }
        previousValues.push(diffHistory[0][0]);
    }
    return getSum(previousValues);
}

console.time("execution time");
const part1Result = calculatePart1();
const part2Result = calculatePart2();
console.timeEnd("execution time");
console.log("part 1:", part1Result); // 1641934234
console.log("part 2:", part2Result); // 975
// 14.633ms
