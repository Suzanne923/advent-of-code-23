const fs = require("fs");

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d21.txt", {
        encoding: "utf-8"
    });
    return fileBuffer
        .trim()
        .split("\r\n")
        .map((row) => row.trim().split(""));
}

const initialGrid = readValuesFromFile();

function getSurroundingCoordinates(y, x) {
    const neighbours = [
        [-1, 0],
        [0, -1],
        [0, 1],
        [1, 0]
    ];
    return neighbours.map(([dy, dx]) => [+y + dy, +x + dx]).filter(([y, x]) => initialGrid[y][x] !== "#");
}

function findStart() {
    for (let y = 0; y < initialGrid.length; y++) {
        for (let x = 0; x < initialGrid[0].length; x++) {
            if (initialGrid[y][x] === "S") {
                return [y, x];
            }
        }
    }
}

function getUnique(coords) {
    return Array.from(new Set(coords.map(JSON.stringify))).map(JSON.parse);
}

function calculatePart1() {
    const start = findStart();
    const steps = 64;
    let validPlots = getSurroundingCoordinates(start[0], start[1]);

    for (let i = 1; i < steps; i++) {
        let newValidPlots = [];
        for (const [y, x] of validPlots) {
            const neighbors = getSurroundingCoordinates(y, x);
            newValidPlots = [...newValidPlots, ...neighbors];
        }
        validPlots = getUnique(newValidPlots);
    }
    return validPlots.length;
}

function calculatePart2() {}

console.time("execution time");
const part1Result = calculatePart1();
// const part2Result = calculatePart2();
console.timeEnd("execution time");
console.log("part 1:", part1Result); //
// console.log("part 2:", part2Result); //
//
