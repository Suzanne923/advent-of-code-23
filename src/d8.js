const fs = require("fs");

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d8.txt", {
        encoding: "utf-8"
    });
    return fileBuffer.trim().split("\r\n");
}

const START = "AAA";
const END = "ZZZ";

function findPath(position = START, paths, instructions) {
    let steps = 0;
    let turn;

    while (position !== END) {
        turn = instructions[steps % instructions.length];
        steps++;
        position = paths[position][turn === "L" ? 0 : 1];
    }

    return steps;
}

function calculatePart1() {
    const input = readValuesFromFile();
    const [instructions, ,] = input.splice(0, 2);
    const paths = mapInputToPaths(input);
    return findPath(START, paths, instructions);
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

function calculatePart2() {}

console.time("execution time");
const part1Result = calculatePart1();
// const part2Result = calculatePart2();
console.timeEnd("execution time");
console.log("part 1:", part1Result); // 247823654
// console.log("part 2:", part2Result); // 245461700
// 43.843ms
