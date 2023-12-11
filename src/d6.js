const fs = require("fs");

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d6.txt", {
        encoding: "utf-8"
    });
    return fileBuffer
        .trim()
        .split("\n")
        .map((v) => v.replace(/\r/, ""));
}

function calculateDistance(buttonHeld, remainingTime) {
    return buttonHeld * remainingTime;
}

function calculateWaysToWin(time, recordDistance) {
    let waysToWin = 0;

    for (let j = 1; j <= time; j++) {
        const remainingTime = time - j;
        if (calculateDistance(j, remainingTime) > recordDistance) {
            waysToWin++;
        }
    }

    return waysToWin;
}

function calculatePart1() {
    const [time, recordDistance] = readValuesFromFile().map((line) => line.trim().split(/\s+/).slice(1).map(Number));

    return time.map((t, i) => calculateWaysToWin(time[i], recordDistance[i])).reduce((a, b) => a * b);
}

function calculatePart2() {
    const [time, recordDistance] = readValuesFromFile()
        .map((line) =>
            line
                .trim()
                .split(/\s+/)
                .slice(1)
                .reduce((a, b) => a + b, "")
        )
        .map(Number);
    const waysToWin = calculateWaysToWin(time, recordDistance);
    return waysToWin;
}

console.time("execution time");
const part1Result = calculatePart1();
const part2Result = calculatePart2();
console.timeEnd("execution time");
console.log("part 1:", part1Result); // 512295
console.log("part 2:", part2Result); // 36530883
// 61.547ms
