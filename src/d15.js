const fs = require("fs");

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d15.txt", {
        encoding: "utf-8"
    });
    return fileBuffer.trim().split(",");
}

const instructions = readValuesFromFile();

function hash(string) {
    let value = 0;

    for (let i = 0; i < string.length; i++) {
        value += string.charCodeAt(i);
        value *= 17;
        value %= 256;
    }

    return value;
}

function calculatePart1() {
    return instructions.reduce((acc, string) => acc + hash(string), 0);
}

function calculatePart2() {
    const boxes = Array(256).fill([]);
    const focalLengths = {};

    for (const instruction of instructions) {
        const label = instruction.replace(/[^a-zA-Z]/g, "");
        const boxIndex = hash(label);

        if (instruction.includes("-")) {
            boxes[boxIndex] = boxes[boxIndex].filter((lens) => lens !== label);
        } else {
            if (!boxes[boxIndex].includes(label)) {
                boxes[boxIndex] = [...boxes[boxIndex], label];
            }
            const focalLength = instruction.replace(/[a-zA-Z=]/g, "");
            focalLengths[label] = focalLength;
        }
    }

    let sum = 0;
    for (let i = 0; i < boxes.length; i++) {
        for (let j = 0; j < boxes[i].length; j++) {
            const label = boxes[i][j];
            sum += (i + 1) * (j + 1) * focalLengths[label];
        }
    }
    return sum;
}

console.time("execution time");
const part1Result = calculatePart1();
const part2Result = calculatePart2();
console.timeEnd("execution time");
console.log("part 1:", part1Result); // 513172
console.log("part 2:", part2Result); // 237806
// 7.167ms
