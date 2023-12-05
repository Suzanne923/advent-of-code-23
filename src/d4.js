const fs = require("fs");

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d4.txt", {
        encoding: "utf-8",
    });
    return fileBuffer
        .trim()
        .split("\n")
        .map((v) => v.replace(/\r/, ""));
}

function getNumOfWinningCards(myCards, winningCards) {
    return myCards.reduce(
        (acc, curr) => (winningCards.includes(curr) ? acc + 1 : acc),
        0
    );
}

function calculateDay4() {
    const values = readValuesFromFile();
    const cards = values.map((line) => {
        const [, a, b] = line.split(/[:|]/);
        return [a.trim().split(/\s+/), b.trim().split(/\s+/)];
    });

    let points = 0;
    let copies = new Array(cards.length).fill(1);
    for (const card in cards) {
        const [winningCards, myCards] = cards[card];
        const wins = getNumOfWinningCards(myCards, winningCards);
        if (!wins) {
            continue;
        } else {
            points += Math.pow(2, wins - 1);
            for (let win = 1; win <= wins; win++) {
                copies[+card + win] += copies[+card];
            }
        }
    }
    const sumCopies = copies.reduce((acc, curr) => acc + curr, 0);
    return { points, sumCopies };
}

console.time("execution time");
const { points, sumCopies } = calculateDay4();
console.timeEnd("execution time");
console.log("part 1: ", points); // 22193
console.log("part 2: ", sumCopies); // 5625994
// 1.699ms
