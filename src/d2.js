const fs = require("fs");

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d2.txt", {
        encoding: "utf-8",
    });
    return fileBuffer
        .trim()
        .split("\n")
        .map((v) => v.replace(/\r/, ""));
}

function gameIsValid(maxCubesPerColor) {
    return (
        maxCubesPerColor.red <= 12 &&
        maxCubesPerColor.green <= 13 &&
        maxCubesPerColor.blue <= 14
    );
}
console.time("execution time");

const validGames = [];
let sumOfPowers = 0;
const games = readValuesFromFile();

for (let game in games) {
    const maxCubesPerColor = {
        red: 0,
        green: 0,
        blue: 0,
    };
    const cubes = games[game]
        .replace(/Game \d+: /, "")
        .split("; ")
        .map((s) => s.split(", "))
        .flat();

    cubes.forEach((set) => {
        const [amount, color] = set.split(" ");
        const currentMaxOfColor = maxCubesPerColor[color];
        if (+amount > currentMaxOfColor) {
            maxCubesPerColor[color] = +amount;
        }
    });

    const powerOfMaxes = Object.values(maxCubesPerColor).reduce(
        (a, b) => a * b
    );
    sumOfPowers += powerOfMaxes;

    if (gameIsValid(maxCubesPerColor)) {
        validGames.push(++game);
    }
}

const sumOfValidGames = validGames.reduce((acc, curr) => acc + curr);
console.timeEnd("execution time");
console.log("part 1: ", sumOfValidGames); // 2505
console.log("part 2: ", sumOfPowers); // 70265
// 1.964ms
