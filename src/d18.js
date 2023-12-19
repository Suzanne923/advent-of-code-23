const fs = require("fs");

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d18.txt", {
        encoding: "utf-8"
    });
    return fileBuffer.trim().split("\r\n");
}

const instructions = readValuesFromFile().map((r) => {
    const [direction, steps, color] = r.split(" ");
    return { direction, steps, color };
});

function getPosition(position, direction, steps) {
    const directions = {
        R: [steps, 0],
        L: [-steps, 0],
        U: [0, -steps],
        D: [0, steps]
    };
    const [x, y] = directions[direction];
    return [position[0] + x, position[1] + y];
}

function calculateArea(coordinates) {
    let area = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
        const [x1, y1] = coordinates[i];
        const [x2, y2] = coordinates[i + 1];
        area += x1 * y2 - x2 * y1;
    }
    return Math.abs(area) / 2;
}

function calculatePart1() {
    let position = [0, 0];
    const pool = [position];
    let edges = 0;

    for (const { direction, steps } of instructions) {
        position = getPosition(position, direction, +steps);
        pool.push(position);
        edges += +steps;
    }

    return Math.floor(calculateArea(pool) + edges / 2) + 1;
}

function calculatePart2() {
    let position = [0, 0];
    const pool = [position];
    let edges = 0;
    const dirs = ["R", "D", "L", "U"];

    for (const { color } of instructions) {
        const steps = parseInt(color.slice(2, -2), 16);
        const direction = dirs[color.slice(-2).slice(0, -1)];
        position = getPosition(position, direction, steps);
        pool.push(position);
        edges += +steps;
    }

    return Math.floor(calculateArea(pool) + edges / 2) + 1;
}

console.time("execution time");
const part1Result = calculatePart1();
const part2Result = calculatePart2();
console.timeEnd("execution time");
console.log("part 1:", part1Result); // 76387
console.log("part 2:", part2Result); // 250022188522074
// 2.483ms
