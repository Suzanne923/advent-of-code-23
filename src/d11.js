const fs = require("fs");

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d11.txt", {
        encoding: "utf-8",
    });
    return fileBuffer
        .trim()
        .split("\r\n")
        .map((line) => line.split(""));
}

let grid = readValuesFromFile();

function expandHorizontally() {
    const newGrid = [];
    grid.forEach((row) => {
        if (row.every((cell) => cell === ".")) {
            newGrid.push(row);
            newGrid.push(row);
        } else {
            newGrid.push(row);
        }
    });
    grid = newGrid;
}

function expandVertically() {
    const newGrid = new Array(grid.length).fill(0).map(() => []);

    for (let i = 0; i < grid[0].length; i++) {
        let galaxyFound = false;

        for (let j = 0; j < grid.length; j++) {
            if (grid[j][i] !== ".") {
                galaxyFound = true;
                break;
            }
        }

        if (!galaxyFound) {
            for (let j = 0; j < grid.length; j++) {
                newGrid[j].push(".");
                newGrid[j].push(".");
            }
        } else {
            for (let j = 0; j < grid.length; j++) {
                newGrid[j].push(grid[j][i]);
            }
        }
    }
    grid = newGrid;
}

function findGalaxies() {
    const galaxies = [];
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === "#") {
                galaxies.push({ y, x });
            }
        }
    }
    return galaxies;
}

function findShortestPath(start, end) {
    return Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
}

function calculatePart1() {
    expandHorizontally();
    expandVertically();
    const galaxies = findGalaxies();
    let sum = 0;

    for (let i = 0; i < galaxies.length; i++) {
        for (let j = i + 1; j < galaxies.length; j++) {
            sum += findShortestPath(galaxies[i], galaxies[j]);
        }
    }
    return sum;
}

console.time("execution time");
const part1Result = calculatePart1();
// const part2Result = calculatePart2();
console.timeEnd("execution time");
console.log("part 1:", part1Result); // 9608724
// console.log("part 2:", part2Result); //
//
