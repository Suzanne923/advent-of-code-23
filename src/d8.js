const fs = require("fs");

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d8.txt", {
        encoding: "utf-8"
    });
    return fileBuffer.trim().split("\r\n");
}

const START = "AAA";

function mapInputToPaths(input) {
    return input.reduce((acc, line) => {
        const [path, directions] = line.split(" = ");
        acc[path] = directions.replace(/\(|\)/g, "").split(", ");
        return acc;
    }, {});
}

function findPath(position = START, paths, instructions) {
    let steps = 0;
    let turn;

    while (position[2] !== "Z") {
        turn = instructions[steps % instructions.length];
        steps++;
        position = paths[position][turn === "L" ? 0 : 1];
    }

    return steps;
}

function lcd() {
    const gcd = (a, b) => (a ? gcd(b % a, a) : b);
    const lcd = (a, b) => (a * b) / gcd(a, b);
    return lcd;
}

function calculatePart1() {
    const input = readValuesFromFile();
    const [instructions, ,] = input.splice(0, 2);
    const paths = mapInputToPaths(input);
    return findPath(START, paths, instructions);
}

function calculatePart2() {
    const input = readValuesFromFile();
    const [instructions, ,] = input.splice(0, 2);
    const paths = mapInputToPaths(input);
    const startPositions = Object.keys(paths).filter(path => path[2] === "A");
    return startPositions.map(position => findPath(position, paths, instructions)).reduce(lcd(), 1);
}

console.time("execution time");
const part1Result = calculatePart1();
const part2Result = calculatePart2();
console.timeEnd("execution time");
console.log("part 1:", part1Result); // 11567
console.log("part 2:", part2Result); // 9858474970153
// 32.487ms
