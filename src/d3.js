const fs = require("fs");

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d3.txt", {
        encoding: "utf-8",
    });
    return fileBuffer
        .trim()
        .split("\n")
        .map((v) => v.replace(/\r/, ""));
}

const grid = readValuesFromFile();

function isNumber(string) {
    return /^\d+$/.test(string);
}
function isSymbol(char) {
    return "/!@#$%^&*()_+-=".includes(char);
}
function getSurroundingCoordinates(y, x) {
    const neighbours = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
    ];
    return neighbours.map(([dx, dy]) => ({ x: +x + dx, y: +y + dy }));
}

function parseNumber(grid, y, x) {
    let numbers = [];
    let forward = x;
    let backward = x - 1;

    while (isNumber(grid[y][backward]) && +backward >= 0) {
        numbers.unshift(grid[y][backward]);
        backward -= 1;
    }
    while (isNumber(grid[y][forward]) && +forward < grid[0].length) {
        numbers.push(grid[y][forward]);
        forward += 1;
    }

    return numbers.join("");
}

function calculatePart1() {
    let sum = 0;

    for (let row in grid) {
        for (let char in grid[row]) {
            if (isSymbol(grid[row][char])) {
                const coordinates = getSurroundingCoordinates(row, char);
                const partNumbers = [];

                coordinates.forEach(({ y, x }) => {
                    const gridValue = grid[y][x];
                    const parsedNumber = parseNumber(grid, y, x);
                    if (
                        isNumber(gridValue) &&
                        !partNumbers.includes(+parsedNumber)
                    ) {
                        partNumbers.push(+parsedNumber);
                    }
                });

                sum += partNumbers.reduce((acc, curr) => acc + curr, 0);
            }
        }
    }
    return sum;
}

function calculatePart2() {
    const symbolsMap = {};

    for (let row in grid) {
        for (let char in grid[row]) {
            if (isSymbol(grid[row][char])) {
                const symbol = grid[row][char];
                const coordinates = getSurroundingCoordinates(row, char);
                const partNumbers = [];

                if (!(symbol in symbolsMap)) {
                    symbolsMap[symbol] = 0;
                }

                coordinates.forEach(({ y, x }) => {
                    const gridValue = grid[y][x];
                    const parsedNumber = parseNumber(grid, y, x);
                    if (
                        isNumber(gridValue) &&
                        !partNumbers.includes(parsedNumber)
                    ) {
                        partNumbers.push(parsedNumber);
                    }
                });

                if (symbol === "*" && partNumbers.length === 2) {
                    symbolsMap["*"] += partNumbers[0] * partNumbers[1];
                }
            }
        }
    }

    return symbolsMap["*"];
}

console.time("execution time");
const part1Result = calculatePart1();
const part2Result = calculatePart2();
console.timeEnd("execution time");
console.log("part 1:", part1Result); // 525181
console.log("part 2:", part2Result); // 84289137
// 12:00.131
