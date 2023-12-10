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

const PIPES = {
    "|": ["N", "S"],
    "-": ["E", "W"],
    L: ["N", "E"],
    J: ["N", "W"],
    7: ["S", "W"],
    F: ["S", "E"],
};
const grid = readValuesFromFile();
const start = getStartCoordinates();
const visitedCells = [];

function getSurroundingCoordinates({ y, x }) {
    const neighbours = [
        [-1, 0],
        [0, -1],
        [0, 1],
        [1, 0],
    ];
    return neighbours
        .map(([dx, dy]) => ({ y: +y + dy, x: +x + dx }))
        .filter(
            (n) =>
                n.y >= 0 &&
                n.x >= 0 &&
                n.y < grid.length &&
                n.x < grid[0].length
        );
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
                { y: y, x: x - 1 },
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
    let aConnects = false;
    let bConnects = false;
    for (let i = 0; i < exitsPipeA.length; i++) {
        if (exitsPipeA[i].x === pipeB.x && exitsPipeA[i].y === pipeB.y) {
            aConnects = true;
        }
    }
    for (let i = 0; i < exitsPipeB.length; i++) {
        if (exitsPipeB[i].x === pipeA.x && exitsPipeB[i].y === pipeA.y) {
            bConnects = true;
        }
    }
    return aConnects && bConnects;
}

function getConnectingPipe(entry, previousPosition) {
    const surroundingCoordinates = getSurroundingCoordinates(entry);
    const surroundingPipes = surroundingCoordinates.filter((c) =>
        Object.keys(PIPES).includes(grid[c.y][c.x])
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

function middleIsReached(nextPipes) {
    return nextPipes.a.y === nextPipes.b.y && nextPipes.a.x === nextPipes.b.x;
}

function calculatePart1() {
    const connectingPipes = getConnectingPipe(start);
    visitedCells.push(start);
    let previousPosition;
    let currentPositions = { a: start, b: start };
    let nextPipes = {
        a: connectingPipes[0],
        b: connectingPipes[1],
    };
    let steps = 0;

    while (!middleIsReached(nextPipes)) {
        steps++;
        previousPosition = { a: currentPositions.a, b: currentPositions.b };
        currentPositions = { a: nextPipes.a, b: nextPipes.b };
        visitedCells.push(...Object.values(currentPositions));
        const a = getConnectingPipe(currentPositions.a, previousPosition.a)[0];
        const b = getConnectingPipe(currentPositions.b, previousPosition.b)[0];
        nextPipes = { a, b };
    }

    visitedCells.push(nextPipes.a);
    return steps + 1;
}

function fillMap(map) {
    visitedCells.forEach(({ y, x }) => (map[y][x] = grid[y][x]));
    for (let row = 0; row < map.length; row++) {
        let isBetween = false;
        let betweenCount = 0;

        for (let cell = 0; cell < map[row].length; cell++) {
            const cellValue = map[row][cell];
            if (["|", "F", "7", "S"].includes(cellValue)) {
                isBetween = !isBetween;
                if (!isBetween) {
                    betweenCount = 0;
                }
            }
            if (cellValue === "." && isBetween) {
                betweenCount++;
                map[row][cell] = "O";
            }
        }
    }
}

function getEnclosingTiles(map) {
    let tiles = 0;
    for (let row = 0; row < map.length; row++) {
        for (let cell = 0; cell < map[row].length; cell++) {
            if (map[row][cell] === "O") {
                tiles++;
            } 
        }
    }
    return tiles;
}

function calculatePart2() {
    let map = Array.apply(null, Array(grid.length)).map(() => {
        return Array.from(".".repeat(grid[0].length));
    });
    fillMap(map);
    const enclosingTiles = getEnclosingTiles(map);
    map = map.map((line) => line.join("")).join("\r\n");
    return enclosingTiles;
}

console.time("execution time");
const part1Result = calculatePart1();
const part2Result = calculatePart2();
console.timeEnd("execution time");
console.log("part 1:", part1Result); // 6738
console.log("part 2:", part2Result); // 579
// 57.596ms
