const fs = require("fs");

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d10.txt", {
        encoding: "utf-8",
    });
    return fileBuffer
        .trim()
        .split("\r\n")
        .map((line) => line.split(""));
}

const PIPES = ["|", "-", "L", "J", "7", "F"];
const grid = readValuesFromFile();
const start = getStartCoordinates();
const visitedCells = [start];

function isValidCoordinate({ y, x }) {
    return y >= 0 && x >= 0 && y < grid.length && x < grid[0].length;
}

function getSurroundingCoordinates({ y, x }) {
    const neighbours = [
        [-1, 0],
        [0, -1],
        [0, 1],
        [1, 0],
    ];
    return neighbours
        .map(([dy, dx]) => ({ y: y + dy, x: x + dx }))
        .filter(isValidCoordinate);
}

function getExitCoordinates({ y, x }) {
    const pipeType = grid[y][x];
    switch (pipeType) {
        case "|":
            return [
                { y: y + 1, x },
                { y: y - 1, x },
            ];
        case "-":
            return [
                { y, x: x - 1 },
                { y, x: x + 1 },
            ];
        case "L":
            return [
                { y, x: x + 1 },
                { y: y - 1, x },
            ];
        case "J":
            return [
                { y, x: x - 1 },
                { y: y - 1, x },
            ];
        case "7":
            return [
                { y, x: x - 1 },
                { y: y + 1, x },
            ];
        case "F":
            return [
                { y, x: x + 1 },
                { y: y + 1, x },
            ];
        case "S":
            return getSurroundingCoordinates(start);
    }
}

function pipesAreConnected(pipeA, pipeB) {
    const exitsPipeA = getExitCoordinates(pipeA);
    const exitsPipeB = getExitCoordinates(pipeB);
    return (
        exitsPipeA.some((exit) => exit.x === pipeB.x && exit.y === pipeB.y) &&
        exitsPipeB.some((exit) => exit.x === pipeA.x && exit.y === pipeA.y)
    );
}

function getConnectingPipe(entry, previousPosition) {
    const surroundingCoordinates = getSurroundingCoordinates(entry);
    const surroundingPipes = surroundingCoordinates.filter((c) =>
        PIPES.includes(grid[c.y][c.x])
    );
    const connectingPipes = [];
    for (const pipe of surroundingPipes) {
        const isConnected = pipesAreConnected(pipe, entry);
        const isPreviousPipe =
            previousPosition !== undefined &&
            pipe.y === previousPosition.y &&
            pipe.x === previousPosition.x;
        if (isConnected && !isPreviousPipe) {
            connectingPipes.push(pipe);
        }
    }
    return connectingPipes;
}

function getStartCoordinates() {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === "S") {
                return { y: +y, x: +x };
            }
        }
    }
}

function middleIsReached(nextA, nextB) {
    return nextA.y === nextB.y && nextA.x === nextB.x;
}

function getEnclosingTiles(map) {
    visitedCells.forEach(({ y, x }) => (map[y][x] = grid[y][x]));
    let enclosingTiles = 0;

    for (let row = 0; row < map.length; row++) {
        let isBetween = false;

        for (let cell = 0; cell < map[row].length; cell++) {
            const cellValue = map[row][cell];
            if (["|", "F", "7", "S"].includes(cellValue)) {
                isBetween = !isBetween;
            }
            if (cellValue === "." && isBetween) {
                enclosingTiles++;
            }
        }
    }
    return enclosingTiles;
}

function updateLoops(loopA, loopB) {
    loopA.previous = loopA.current;
    loopB.previous = loopB.current;
    loopA.current = loopA.next;
    loopB.current = loopB.next;
    loopA.next = getConnectingPipe(loopA.current, loopA.previous)[0];
    loopB.next = getConnectingPipe(loopB.current, loopB.previous)[0];
}

function calculatePart1() {
    const connectingPipes = getConnectingPipe(start);
    const loopA = {
        current: start,
        next: connectingPipes[0],
    };
    const loopB = {
        current: start,
        next: connectingPipes[1],
    };
    let steps = 0;

    while (!middleIsReached(loopA.next, loopB.next)) {
        steps++;
        updateLoops(loopA, loopB);
        visitedCells.push(loopA.current, loopB.current);
    }

    visitedCells.push(loopA.next);
    return steps + 1;
}

function calculatePart2() {
    const map = Array.from({ length: grid.length }, () =>
        Array(grid[0].length).fill(".")
    );
    return getEnclosingTiles(map);
}

console.time("execution time");
const part1Result = calculatePart1();
const part2Result = calculatePart2();
console.timeEnd("execution time");
console.log("part 1:", part1Result); // 6738
console.log("part 2:", part2Result); // 579
// 39.372ms
