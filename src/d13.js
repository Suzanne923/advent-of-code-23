const fs = require("fs");

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d13.txt", {
        encoding: "utf-8"
    });
    return fileBuffer
        .trim()
        .split(/\r?\n\r?\n/)
        .map((p) => p.trim().split("\r\n"));
}

const patterns = readValuesFromFile();

function findHorizontalReflection(pattern, canHaveSmudge) {
    for (let y = 1; y < pattern.length; y++) {
        if (isHorizontalReflection(pattern, y, canHaveSmudge)) {
            return y * 100;
        }
    }
    return 0;
}

function isHorizontalReflection(pattern, i, canHaveSmudge) {
    let row = i;
    let reflection = i - 1;
    let foundSmudge = false;
    while (row < pattern.length && reflection >= 0) {
        for (let x = 0; x < pattern[0].length; x++) {
            if (pattern[row][x] !== pattern[reflection][x]) {
                if (!canHaveSmudge || foundSmudge) {
                    return false;
                } else {
                    foundSmudge = true;
                }
            }
        }
        row++;
        reflection--;
    }
    return canHaveSmudge ? foundSmudge : true;
}

function findVerticalReflection(pattern, canHaveSmudge) {
    for (let x = 1; x < pattern[0].length; x++) {
        if (isVerticalReflection(pattern, x, canHaveSmudge)) {
            return x;
        }
    }
    return 0;
}

function isVerticalReflection(pattern, i, canHaveSmudge) {
    let column = i;
    let reflection = i - 1;
    let foundSmudge = false;
    while (column < pattern[0].length && reflection >= 0) {
        for (let y = 0; y < pattern.length; y++) {
            if (pattern[y][column] !== pattern[y][reflection]) {
                if (!canHaveSmudge || foundSmudge) {
                    return false;
                } else {
                    foundSmudge = true;
                }
            }
        }
        column++;
        reflection--;
    }
    return canHaveSmudge ? foundSmudge : true;
}

function calculatePart1() {
    return patterns.reduce((acc, pattern) => {
        return (acc += Math.max(findHorizontalReflection(pattern, false), findVerticalReflection(pattern, false)));
    }, 0);
}

function calculatePart2() {
    return patterns.reduce((acc, pattern) => {
        return (acc += Math.max(findHorizontalReflection(pattern, true), findVerticalReflection(pattern, true)));
    }, 0);
}

console.time("execution time");
const part1Result = calculatePart1();
const part2Result = calculatePart2();
console.timeEnd("execution time");
console.log("part 1:", part1Result); // 35360
console.log("part 2:", part2Result); // 36755
// 2.606ms
