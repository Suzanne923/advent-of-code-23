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
        ranges: ranges
            .map(line => {
                const [destinationStart, sourceStart, range] = line.split(" ").map(Number);
                return { destinationStart, sourceStart, range };
            })
            .sort((a, b) => a.sourceStart - b.sourceStart)
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
        if (val < ranges[0].sourceStart) {
            continue;
        }

        let left = 0;
        let right = ranges.length - 1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const { destinationStart, sourceStart, range } = ranges[mid];

            if (valueIsInRange({ sourceStart, range }, val)) {
                const diff = val - sourceStart;
                return destinationStart + diff;
            }

            if (val < sourceStart) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
    }

    return val;
}

function calculatePart1() {
    return Math.min(...seedValues.map(convertValue));
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

const part1Result = calculatePart1();
const part2Result = calculatePart2();
