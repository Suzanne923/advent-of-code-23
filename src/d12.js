const fs = require("fs");

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d12.txt", {
        encoding: "utf-8"
    });
    return fileBuffer.trim().split("\r\n");
}

const records = readValuesFromFile();

function getSum(numbers) {
    return numbers.reduce((acc, curr) => acc + curr, 0);
}

function calculateArrangements(lineData, groups) {
    if (groups.length === 0) {
        // if there are any unmatched "#" left, the arrangement is invalid
        return lineData.length === 0 || !lineData.includes("#") ? 1 : 0;
    }

    if (lineData.length < getSum(groups) + groups.length - 1) {
        // not enough line data to match contiguous groups, invalid arrangement
        return 0;
    }

    if (lineData[0] === ".") {
        return calculateArrangements(lineData.slice(1), groups);
    }

    if (lineData[0] === "#") {
        const [group, ...remainingGroups] = groups;
        if (lineData.slice(0, group).includes(".")) {
            // found ".", line data didn't match contiguous group, invalid arrangement;
            return 0;
        }

        if (lineData[group] === "#") {
            // contiguous group was larger than group to match, invalid arrangement;
            return 0;
        }

        // found matching number of "#" for contiguous group, continue with remaining data;
        return calculateArrangements(lineData.slice(group + 1), remainingGroups);
    }

    // each ? can be either # or ., count arrangements for both possibilities
    return (
        calculateArrangements("#" + lineData.slice(1), groups) + calculateArrangements("." + lineData.slice(1), groups)
    );
}

function getSumOfArrangements(copies) {
    return records.reduce((sum, record) => {
        const [lineData, groupsData] = record.split(" ");
        const line = Array(copies).fill(lineData).join("?");
        const groups = new Array(copies).fill(groupsData.split(",").map(Number)).flat();
        return sum + calculateArrangements(line, groups);
    }, 0);
}

function calculatePart1() {
    return getSumOfArrangements(1);
}

function calculatePart2() {
    return getSumOfArrangements(5);
}

console.time("execution time");
const part1Result = calculatePart1();
// const part2Result = calculatePart2();
console.timeEnd("execution time");
console.log("part 1:", part1Result); // 7843
// console.log("part 2:", part2Result); //
//
