const fs = require("fs");

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d16.txt", {
        encoding: "utf-8"
    });
    return fileBuffer
        .trim()
        .split("\r\n")
        .map((r) => r.split(""));
}

const grid = readValuesFromFile();
const beams = [];
const mirrors = ["/", "\\"];
const splitters = ["|", "-"];
let energizedTiles;
let reflectedTiles;

function getGridCopy() {
    return grid.map((row) => {
        return row.slice();
    });
}

function resetGrid() {
    energizedTiles = getGridCopy();
    reflectedTiles = [];
}

function getNextPosition({ y, x }, direction) {
    switch (direction) {
        case "U":
            return { y: y - 1, x };
        case "D":
            return { y: y + 1, x };
        case "R":
            return { y, x: x + 1 };
        case "L":
            return { y, x: x - 1 };
    }
}

function isOutOfBounds({ y, x }) {
    return y < 0 || x < 0 || y >= grid.length || x >= grid[0].length;
}

function isHit({ y, x }, direction) {
    if (isOutOfBounds({ y, x })) {
        return false;
    }
    const nextChar = grid[y][x];

    if (![...mirrors, ...splitters].includes(nextChar)) {
        return false;
    }
    if (mirrors.includes(nextChar)) {
        return true;
    }
    if (direction === "R" || direction === "L") {
        return nextChar === "|";
    }
    if (direction === "U" || direction === "D") {
        return nextChar === "-";
    }
}

function tileHasReflected(nextPosition, direction) {
    return (
        reflectedTiles.filter(
            (tile) =>
                tile.position.y === nextPosition.y && tile.position.x === nextPosition.x && tile.direction === direction
        ).length === 0
    );
}

function pushNextBeams(nextPosition, prevDirection) {
    const nextChar = grid[nextPosition.y][nextPosition.x];
    let direction;

    switch (nextChar) {
        case "/":
            if (prevDirection === "U") direction = "R";
            if (prevDirection === "D") direction = "L";
            if (prevDirection === "R") direction = "U";
            if (prevDirection === "L") direction = "D";
            beams.push({ start: nextPosition, direction });
            break;
        case "\\":
            if (prevDirection === "U") direction = "L";
            if (prevDirection === "D") direction = "R";
            if (prevDirection === "R") direction = "D";
            if (prevDirection === "L") direction = "U";
            beams.push({ start: nextPosition, direction });
            break;
        case "-":
            beams.push({ start: nextPosition, direction: "R" });
            beams.push({ start: nextPosition, direction: "L" });
            break;
        case "|":
            beams.push({ start: nextPosition, direction: "U" });
            beams.push({ start: nextPosition, direction: "D" });
            break;
    }
}

function trackBeam(start, direction) {
    let currentPosition = start;
    let nextPosition = start;
    let hit = false;
    let outOfBounds = false;

    while (!hit && !outOfBounds) {
        currentPosition = nextPosition;
        energizedTiles[currentPosition.y][currentPosition.x] = "#";
        nextPosition = getNextPosition(currentPosition, direction);
        outOfBounds = isOutOfBounds(nextPosition);
        hit = isHit(nextPosition, direction);
    }

    if (hit) {
        const reflectedTile = { position: nextPosition, direction };
        if (tileHasReflected(nextPosition, direction)) {
            reflectedTiles.push(reflectedTile);
            pushNextBeams(nextPosition, direction);
        }
    }
}

function calculateEnergizedTiles(start) {
    resetGrid();
    beams.push(start);
    while (beams.length > 0) {
        const { start, direction } = beams.shift();
        trackBeam(start, direction);
    }
    return energizedTiles.reduce((acc, row) => acc + row.filter((c) => c === "#").length, 0);
}

function calculatePart1() {
    const start = { start: { y: 0, x: 0 }, direction: "R" };
    return calculateEnergizedTiles(start);
}

function calculatePart2() {
    const startPoints = [];
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid.length; x++) {
            if (y === 0) {
                startPoints.push({ start: { y, x }, direction: "D" });
            }
            if (y === grid.length - 1) {
                startPoints.push({ start: { y, x }, direction: "U" });
            }
            if (x === 0) {
                startPoints.push({ start: { y, x }, direction: "R" });
            }
            if (x === grid[0].length - 1) {
                startPoints.push({ start: { y, x }, direction: "L" });
            }
        }
    }

    return startPoints.reduce((acc, beam) => Math.max(acc, calculateEnergizedTiles(beam)), 0);
}

console.time("execution time");
const part1Result = calculatePart1();
const part2Result = calculatePart2();
console.timeEnd("execution time");
console.log("part 1:", part1Result); // 7046
console.log("part 2:", part2Result); // 7313
// 585.58ms
