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

function findGalaxies() {
    const galaxies = [];
    grid.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === "#") {
                galaxies.push({ y, x });
            }
        });
    });
    return galaxies;
}

function hasGalaxiesInRow(gridRow) {
    return !gridRow.every((cell) => cell === ".");
}

function hasGalaxiesInColumn(columnIndex) {
    return grid.some((row) => row[columnIndex] !== ".");
}

function getGalaxyAfterExpansion({ y, x }, expansionFactor) {
    const rowsWithoutGalaxies = grid.filter(
        (row, i) => i < y && !hasGalaxiesInRow(row)
    ).length;
    const columnsWithoutGalaxies = grid[0].filter(
        (_col, i) => i < x && !hasGalaxiesInColumn(i)
    ).length;
    const row =
        rowsWithoutGalaxies * expansionFactor + (y - rowsWithoutGalaxies);
    const col =
        columnsWithoutGalaxies * expansionFactor + (x - columnsWithoutGalaxies);
    return { y: row, x: col };
}

function findShortestPath(start, end) {
    return Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
}

function getSumOfPaths(galaxies) {
    let sum = 0;

    for (let i = 0; i < galaxies.length; i++) {
        for (let j = i + 1; j < galaxies.length; j++) {
            sum += findShortestPath(galaxies[i], galaxies[j]);
        }
    }
    return sum;
}

function calculatePart1() {
    const expansionFactor = 2;
    const galaxies = findGalaxies().map((g) =>
        getGalaxyAfterExpansion(g, expansionFactor)
    );
    return getSumOfPaths(galaxies, expansionFactor);
}

function calculatePart2() {
    const expansionFactor = 1000000;
    const galaxies = findGalaxies().map((g) =>
        getGalaxyAfterExpansion(g, expansionFactor)
    );
    return getSumOfPaths(galaxies, expansionFactor);
}

console.time("execution time");
const part1Result = calculatePart1();
const part2Result = calculatePart2();
console.timeEnd("execution time");
console.log("part 1:", part1Result); // 9608724
console.log("part 2:", part2Result); // 904633799472
// 27.187ms
