const fs = require("fs");

const CARD_VALUES = "23456789TJQKA";
const CARD_VALUES_JOKERS = "J23456789TQKA";

function getCardStrength(card, canUseJokers) {
    return canUseJokers
        ? CARD_VALUES_JOKERS.indexOf(card)
        : CARD_VALUES.indexOf(card);
}

function calculateScore(handStr, canUseJokers) {
    const frequencies = [0, 0, 0, 0, 0, 0];
    const jokers = handStr.split("J").length - 1;
    const hasJokers = canUseJokers && jokers > 0;

    if (canUseJokers) {
        if (jokers == 5) {
            return 7;
        }
        handStr = handStr.replaceAll(/J+/g, "");
    }

    [...new Set(handStr.split(""))]
        .map((key) => handStr.split(key).length - 1)
        .forEach((freq) => (frequencies[freq] += 1));

    if (frequencies[5] > 0) {
        return 7;
    }
    if (frequencies[4] > 0) {
        if (hasJokers) {
            return 7;
        }
        return 6;
    }
    if (frequencies[3] > 0) {
        if (frequencies[2] > 0) {
            return 5;
        } else if (hasJokers) {
            return jokers === 2 ? 7 : 6;
        }
        return 4;
    }
    if (frequencies[2] === 2) {
        if (hasJokers) {
            return 5;
        }
        return 3;
    }
    if (frequencies[2] === 1) {
        if (hasJokers) {
            if (jokers === 3) {
                return 7;
            }
            return jokers * 2 + 2;
        }
        return 2;
    }
    if (hasJokers) {
        if (jokers === 4) {
            return 7;
        }
        return jokers * 2;
    }
    return 1;
}

function compareHands(a, b, canUseJokers) {
    if (b.score > a.score) return -1;
    if (a.score > b.score) return 1;

    let aWins = -1;
    for (const i in a.hand) {
        if (
            getCardStrength(a.hand[i], canUseJokers) >
            getCardStrength(b.hand[i], canUseJokers)
        ) {
            aWins = 1;
            break;
        }
        if (
            getCardStrength(b.hand[i], canUseJokers) >
            getCardStrength(a.hand[i], canUseJokers)
        ) {
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
                score: calculateScore(hand, false),
            };
        });
    const sortedHands = hands.sort((a, b) => compareHands(a, b, false));
    return sortedHands.reduce((acc, { bid }, i) => acc + bid * (i + 1), 0);
}
function calculatePart2() {
    let hands = readValuesFromFile()
        .map((h) => h.trim().split(/\s+/))
        .map(([hand, bid]) => {
            return {
                hand,
                bid: Number(bid),
                score: calculateScore(hand, true),
            };
        });
    const sortedHands = hands.sort((a, b) => compareHands(a, b, true));
    return sortedHands.reduce((acc, { bid }, i) => acc + bid * (i + 1), 0);
}

console.time("execution time");
const part1Result = calculatePart1();
const part2Result = calculatePart2();
console.timeEnd("execution time");
console.log("part 1:", part1Result); // 247823654
console.log("part 2:", part2Result); // 245461700
// 43.843ms
