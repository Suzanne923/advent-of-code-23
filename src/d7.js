const fs = require("fs");

const CARD_VALUES = "23456789TJQKA";

function getCardStrength(card) {
    return CARD_VALUES.indexOf(card);
}

function calculateScore(handStr) {
    const frequencies = [0, 0, 0, 0, 0, 0];
    [...new Set(handStr.split(""))]
        .map((key) => handStr.split(key).length - 1)
        .forEach((freq) => (frequencies[freq] += 1));
    console.log(handStr, frequencies);

    if (frequencies[5] > 0) {
        return 7;
    }
    if (frequencies[4] > 0) {
        return 6;
    }
    if (frequencies[3] > 0) {
        if (frequencies[2] > 0) {
            return 5;
        }
        return 4;
    }
    if (frequencies[2] === 2) {
        return 3;
    }
    if (frequencies[2] === 1) {
        return 2;
    }
    return 1;
}

function compareHands(a, b) {
    if (b.score > a.score) return -1;
    if (a.score > b.score) return 1;
    
    let aWins = -1;
    for (const i in a.hand) {
        if (getCardStrength(a.hand[i]) > getCardStrength(b.hand[i])) {
            aWins = 1;
            break;
        }
        if (getCardStrength(b.hand[i]) > getCardStrength(a.hand[i])) {
            break;
        }
    }
    return aWins;
}

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d7.txt", {
        encoding: "utf-8",
    });
    return fileBuffer.trim().split("\r\n");
}

function calculatePart1() {
    let hands = readValuesFromFile()
        .map((h) => h.trim().split(/\s+/))
        .map(([hand, bid]) => {
            return {
                hand,
                bid: Number(bid),
                score: calculateScore(hand),
            };
        });
    const sortedHands = hands.sort(compareHands);
    console.log(sortedHands);
    return sortedHands.reduce((acc, { bid }, i) => acc + bid * (i + 1), 0);
}
function calculatePart2() {}

console.time("execution time");
const part1Result = calculatePart1();
const part2Result = calculatePart2();
console.timeEnd("execution time");
console.log("part 1:", part1Result); // 247823654
//console.log("part 2:", part2Result);
// time
