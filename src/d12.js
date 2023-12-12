const fs = require("fs");

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d12.txt", {
        encoding: "utf-8"
    });
    return fileBuffer.trim().split("\r\n");
}

const records = readValuesFromFile();
const memo = new Map();

function calculateArrangements(lineData, groups) {
    const memoKey = lineData + "-" + groups.join(",");
    if (memo.has(memoKey)) {
        return memo.get(memoKey);
    }

    if (groups.length === 0) {
        // if there are any unmatched "#" left, the arrangement is invalid
        const result = lineData.length === 0 || !lineData.includes("#") ? 1 : 0;
        memo.set(memoKey, result);
        return result;
    }

    if (lineData.length < groups.reduce((acc, group) => acc + group, 0) + groups.length - 1) {
        // not enough line data to match contiguous groups, invalid arrangement
        memo.set(memoKey, 0);
        return 0;
    }

    if (lineData[0] === ".") {
        const result = calculateArrangements(lineData.slice(1), groups);
        memo.set(memoKey, result);
        return result;
    }

    if (lineData[0] === "#") {
        const [group, ...remainingGroups] = groups;

        if (lineData.slice(0, group).includes(".")) {
            // found ".", line data didn't match contiguous group, invalid arrangement;
            memo.set(memoKey, 0);
            return 0;
        }

        if (lineData[group] === "#") {
            // contiguous group was larger than group to match, invalid arrangement;
            memo.set(memoKey, 0);
            return 0;
        }

        // found matching number of "#" for contiguous group, continue with remaining data;
        const result = calculateArrangements(lineData.slice(group + 1), remainingGroups);
        memo.set(memoKey, result);
        return result;
    }

    // each ? can be either "#" or ".", count arrangements for both possibilities
    const result =
        calculateArrangements("#" + lineData.slice(1), groups) + calculateArrangements("." + lineData.slice(1), groups);

    memo.set(memoKey, result);
    return result;
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
const part2Result = calculatePart2();
console.timeEnd("execution time");
console.log("part 1:", part1Result); // 7843
console.log("part 2:", part2Result); // 10153896718999
// 496.348ms
