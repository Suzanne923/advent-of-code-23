const fs = require("fs");

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d14.txt", {
        encoding: "utf-8"
    });
    return fileBuffer
        .trim()
        .split("\r\n")
        .map((line) => line.trim().split(""));
}

function tilt(grid) {
    for (let row = 1; row < grid.length; row++) {
        for (let x = 0; x < grid[row].length; x++) {
            if (grid[row][x] === "O") {
                let previousRow = row;
                for (let y = row - 1; y >= 0; y--) {
                    if (grid[y][x] === "#" || grid[y][x] === "O") {
                        break;
                    } else {
                        grid[y][x] = "O";
                        grid[previousRow][x] = ".";
                        previousRow = y;
                    }
                }
            }
        }
    }
}

function turn(grid) {
    return grid[0].map((_, index) => grid.map((row) => row[index]).reverse());
}

function getLoadForRow(grid, i) {
    return (grid.length - i) * grid[i].filter((char) => char === "O").length;
}

function calculateLoad(grid) {
    return grid.reduce((acc, _, i) => acc + getLoadForRow(grid, i), 0);
}

function runCycle(grid) {
    tilt(grid);
    grid = turn(grid);
    tilt(grid);
    grid = turn(grid);
    tilt(grid);
    grid = turn(grid);
    tilt(grid);
    grid = turn(grid);
    return grid;
}

function createKey(grid) {
    return JSON.stringify(grid);
}

function calculatePart1() {
    const grid = readValuesFromFile();
    tilt(grid);
    return calculateLoad(grid);
}

function calculatePart2() {
    const cache = new Map();
    let grid = readValuesFromFile();
    let cycles = 0;
    let lastKey;

    while (!cache.has(lastKey)) {
        cache.set(lastKey, calculateLoad(grid));
        cycles++;
        grid = runCycle(grid);
        lastKey = createKey(grid);
    }

    const keys = Array.from(cache.keys());
    const stableKeys = keys.slice(keys.indexOf(lastKey));
    const lastKeyIndex = (1000000000 - cycles) % stableKeys.length;
    return cache.get(stableKeys[lastKeyIndex]);
}

console.time("execution time");
const part1Result = calculatePart1();
const part2Result = calculatePart2();
console.timeEnd("execution time");
console.log("part 1:", part1Result); // 108792
console.log("part 2:", part2Result); // 99118
// 479.675ms
