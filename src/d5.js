const fs = require("fs");

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d5.txt", {
        encoding: "utf-8"
    });
    return fileBuffer.trim().split(/\r?\n\r?\n/);
}

const mapValues = readValuesFromFile();
const seedValues = mapValues.shift().split(": ")[1].split(" ").map(Number);
const seedRanges = getSeedRanges();
const maps = mapValues.map((m) => {
    const [mapType, ...ranges] = m.split(/\r?\n/);
    return {
        mapType,
        ranges: ranges
            .map((line) => {
                const [destinationStart, sourceStart, range] = line.split(" ").map(Number);
                return { destinationStart, sourceStart, range };
            })
            .sort((a, b) => a.sourceStart - b.sourceStart)
    };
});

function getSeedRanges() {
    const seedRanges = [];
    for (let i = 0; i < seedValues.length; i += 2) {
        seedRanges.push({
            start: seedValues[i],
            end: seedValues[i] + seedValues[i + 1]
        });
    }
    return seedRanges;
}

function valueIsInRange(sourceStart, range, val) {
    return val >= sourceStart && val < sourceStart + range;
}

function convertValue(val) {
    for (const { ranges } of maps) {
        if (val < ranges[0].sourceStart) {
            continue;
        }

        for (const { destinationStart, sourceStart, range } of ranges) {
            if (valueIsInRange(sourceStart, range, val)) {
                const diff = val - sourceStart;
                val = destinationStart + diff;
                break;
            }
        }
    }
    return val;
}

function calculatePart1() {
    return seedValues.map(convertValue).sort().shift();
}

function calculatePart2() {
    let lowestVal = Infinity;
    for (const { start, end } of seedRanges) {
        for (let j = start; j <= end; j++) {
            const location = convertValue(j);
            lowestVal = Math.min(lowestVal, location);
        }
    }
    return lowestVal;
}

console.time("execution time");
const part1Result = calculatePart1();
const part2Result = calculatePart2();
console.timeEnd("execution time");
console.log("part 1:", part1Result); // 175622908
console.log("part 2:", part2Result); // 5200543
// 12:00.131 (m:ss.mmm)
