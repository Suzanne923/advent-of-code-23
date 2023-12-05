const fs = require("fs");

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d5.txt", { encoding: "utf-8" });
    return fileBuffer.trim().split(/\r?\n\r?\n/);
}

const mapValues = readValuesFromFile();
const seedValues = mapValues.shift().split(": ")[1].split(" ").map(Number);
const seedRanges = getSeedRanges(seedValues);
const maps = mapValues.map(m => {
    const [mapType, ...ranges] = m.split(/\r?\n/);
    return {
        mapType,
        ranges: ranges.map(line => {
            const [destinationStart, sourceStart, range] = line.split(" ").map(Number);
            return { destinationStart, sourceStart, range };
        })
    };
});

function getSeedRanges(seedValues) {
    const seedRanges = [];
    for (let i = 0; i < seedValues.length; i += 2) {
        seedRanges.push({ start: seedValues[i], end: seedValues[i] + seedValues[i + 1] });
    }
    return seedRanges;
}

function valueIsInRange({ sourceStart, range }, val) {
    return val >= sourceStart && val < sourceStart + range;
}

function convertValue(val) {
    for (const { ranges } of maps) {
        for (const { destinationStart, sourceStart, range } of ranges) {
            if (valueIsInRange({ sourceStart, range }, val)) {
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
    for (let i in seedRanges) {
        const { start, end } = seedRanges[i];
        for (let j = start; j <= end; j++) {
            const location = convertValue(j);
            lowestVal = Math.min(lowestVal, location);
        }
    }
    return lowestVal;
}

console.log("part 1: ", calculatePart1());
console.log("part 2: ", calculatePart2());
