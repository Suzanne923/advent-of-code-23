const fs = require("fs");

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d5.txt", { encoding: "utf-8" });
    return fileBuffer.trim().split(/[\r]?\n[\r]?\n/g);
}

const mapValues = readValuesFromFile();
const seeds = mapValues
    .shift()
    .split(": ")[1]
    .split(" ")
    .map(v => +v);
const maps = mapValues.map(m => {
    const current = m.split(/\r\n/);
    const tmp = { mapType: current.shift(), ranges: [] };
    for (const value in current) {
        [destinationStart, sourceStart, range] = current[value].split(" ").map(v => +v);
        tmp.ranges.push({ destinationStart, sourceStart, range });
    }
    return tmp;
});

function valueIsInRange({ sourceStart, range }, val) {
    return val >= sourceStart && val < sourceStart + range;
}

function convertValue(val) {
    let newVal = val;
    for (const i in maps) {
        const ranges = maps[i].ranges;
        const tmp = newVal;
        for (const j in ranges) {
            const { destinationStart, sourceStart, range } = ranges[j];
            if (valueIsInRange(ranges[j], newVal)) {
                const diff = newVal - sourceStart;
                newVal = destinationStart + diff;
                break;
            }
        }
    }
    return newVal;
}

function calculatePart1() {
    const locationValues = seeds.map(s => convertValue(s)).sort((a, b) => a - b);
    return locationValues[0];
}

console.log("part 1: ", calculatePart1());
