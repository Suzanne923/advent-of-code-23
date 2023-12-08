const fs = require("fs");

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d8.txt", {
        encoding: "utf-8"
    });
    return fileBuffer.trim().split("\r\n");
}

const START = "AAA";

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

function mapInputToPaths(input) {
    return input
        .map(line => {
            const [path, directions] = line.split(" = ");
            return [path, directions.replace(/\(|\)/g, "").split(", ")];
        })
        .reduce((acc, [start, directions]) => {
            acc[start] = directions;
            return acc;
        }, {});
}

function leastCommonDivisor() {
    const gcd = (a, b) => (a ? gcd(b % a, a) : b);
    const lcm = (a, b) => (a * b) / gcd(a, b);
    return lcm;
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
    return startPositions.map(position => findPath(position, paths, instructions)).reduce(leastCommonDivisor());
}

console.time("execution time");
const part1Result = calculatePart1();
const part2Result = calculatePart2();
console.timeEnd("execution time");
console.log("part 1:", part1Result); // 11567
console.log("part 2:", part2Result); // 9858474970153
// 32.487ms
