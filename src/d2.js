const fs = require("fs");

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d2.txt", {
        encoding: "utf-8"
    });
    return fileBuffer
        .trim()
        .split("\n")
        .map((v) => v.replace(/\r/, ""));
}

function gameIsValid(maxCubesPerColor) {
    return maxCubesPerColor.red <= 12 && maxCubesPerColor.green <= 13 && maxCubesPerColor.blue <= 14;
}

function calculateDay2(filePath) {
    const games = readValuesFromFile(filePath);
    let sumOfPowers = 0;
    const validGames = [];

    for (let i = 0; i < games.length; i++) {
        const maxCubesPerColor = {
            red: 0,
            green: 0,
            blue: 0
        };

        const cubes = games[i]
            .replace(/Game \d+: /, "")
            .split("; ")
            .flatMap((s) => s.split(", "));

        cubes.forEach((set) => {
            const [amount, color] = set.split(" ");
            const currentMaxOfColor = maxCubesPerColor[color];
            maxCubesPerColor[color] = Math.max(+amount, currentMaxOfColor);
        });

        const powerOfMaxes = Object.values(maxCubesPerColor).reduce((a, b) => a * b);
        sumOfPowers += powerOfMaxes;

        if (gameIsValid(maxCubesPerColor)) {
            validGames.push(i + 1);
        }
    }

    const sumOfValidGames = validGames.reduce((acc, curr) => acc + curr);

    return { sumOfValidGames, sumOfPowers };
}

console.time("execution time");
const { sumOfValidGames, sumOfPowers } = calculateDay2();
console.timeEnd("execution time");
console.log("part 1: ", sumOfValidGames); // 2505
console.log("part 2: ", sumOfPowers); // 70265
// 1.964ms
