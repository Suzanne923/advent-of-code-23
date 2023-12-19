const fs = require("fs");

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d19.txt", {
        encoding: "utf-8"
    });
    return fileBuffer.trim().split(/\r?\n\r?\n/);
}

const regex = /([xmas])([<>])(\d+):(\w+)/;
const [rows, parts] = readValuesFromFile();
const workflows = parseWorkFlows(rows);
const start = "in";

function parseWorkFlows(data) {
    return data
        .trim()
        .split("\r\n")
        .reduce((acc, row) => {
            const [name, rulesStr] = row.split("{");
            const rules = rulesStr.split(",");
            const end = rules.pop().replace("}", "").trim();
            acc[name.trim()] = {
                end,
                rules: rules.map(rule => {
                    const [_, rating, operator, target, nextRule] = rule.match(regex);
                    return { rating, operator, target, nextRule };
                })
            };
            return acc;
        }, {});
}

function parseWorkFlowsP2(data) {
    return data
        .trim()
        .split("\r\n")
        .reduce((acc, row) => {
            const [name, rulesStr] = row.split("{");
            const rules = rulesStr.split(",");
            const lastChild = rules.pop().replace("}", "").trim();
            acc[name.trim()] = {
                rules: rules
                    .map(rule => {
                        const [_, rating, operator, target, nextRule] = rule.match(regex);
                        return { rating, operator, target: Number(target), nextRule };
                    })
                    .concat({ nextRule: lastChild })
            };
            return acc;
        }, {});
}

function parseRatings(parts) {
    return parts
        .split("\n")
        .map(part =>
            part
                .replaceAll(/[{}]/g, "")
                .split(",")
                .map(p => p.split("="))
        )
        .map(part =>
            part.reduce((acc, [key, value]) => {
                acc[key] = Number(value);
                return acc;
            }, {})
        );
}

function isAcceptedPart(name, ratings) {
    if (name === "A") {
        return true;
    } else if (name === "R") {
        return false;
    }

    const { end, rules } = workflows[name];
    for (const { rating, operator, target, nextRule } of rules) {
        if ((operator === "<" && ratings[rating] < target) || (operator === ">" && ratings[rating] > target)) {
            return isAcceptedPart(nextRule, ratings);
        }
    }

    return isAcceptedPart(end, ratings);
}

function calculatePart1() {
    const partRatings = parseRatings(parts);

    return partRatings
        .filter(ratings => isAcceptedPart(start, ratings))
        .map(({ x, m, a, s }) => x + m + a + s)
        .reduce((sum, rSum) => sum + rSum, 0);
}

function getSumCombinations(ranges) {
    const { x, m, a, s } = ranges;
    const delta = ([min, max]) => Math.abs(max - min) + 1;
    return delta(x) * delta(m) * delta(a) * delta(s);
}

function getCombinations(name, ranges) {
    const newWorkFlows = parseWorkFlowsP2(rows);

    if (name === "A") {
        return getSumCombinations(ranges);
    } else if (name === "R") {
        return 0;
    }

    let sumCombinations = 0;
    let newRanges = { ...ranges };
    const rules = newWorkFlows[name].rules;

    for (let i = 0; i < rules.length; i++) {
        const { rating, operator, target, nextRule } = rules[i];

        if (!operator) {
            sumCombinations += getCombinations(nextRule, newRanges);
        } else if (operator === "<") {
            const range = newRanges[rating];
            newRanges = { ...newRanges, [rating]: [range[0], target - 1] };
            sumCombinations += getCombinations(nextRule, newRanges);
            newRanges = { ...newRanges, [rating]: [target, range[1]] };
        } else if (operator === ">") {
            const range = newRanges[rating];
            newRanges = { ...newRanges, [rating]: [target + 1, range[1]] };
            sumCombinations += getCombinations(nextRule, newRanges);
            newRanges = { ...newRanges, [rating]: [range[0], target] };
        }
    }
    return sumCombinations;
}

function calculatePart2() {
    const defaultRanges = {
        x: [1, 4000],
        m: [1, 4000],
        a: [1, 4000],
        s: [1, 4000]
    };

    return getCombinations(start, defaultRanges);
}

console.time("execution time");
const part1Result = calculatePart1();
const part2Result = calculatePart2();
console.timeEnd("execution time");
console.log("part 1:", part1Result); // 476889
console.log("part 2:", part2Result); // 132380153677887
// 4.250s
