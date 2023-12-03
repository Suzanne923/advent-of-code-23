const fs = require("fs");

function readValuesFromFile() {
  const fileBuffer = fs.readFileSync("../inputs/d3.txt", { encoding: "utf-8" });
  return fileBuffer
    .trim()
    .split("\n")
    .map((v) => v.replace(/\r/, ""));
}

const grid = readValuesFromFile();

function isNumber(string) {
  return /^\d+$/.test(string);
}
function isSymbol(char) {
  return "/!@#$%^&*()_+-=".includes(char);
}
function getSurroundingCoordinates(y, x) {
  const neighbours = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  return neighbours.map(([dx, dy]) => ({ x: +x + dx, y: +y + dy }));
}

function parseNumber(grid, y, x) {
  let numbers = [];
  let forward = x;
  let backward = x - 1;

  while (isNumber(grid[y][backward]) && +backward >= 0) {
    numbers.unshift(grid[y][backward]);
    backward -= 1;
  }
  while (isNumber(grid[y][forward]) && +forward < 140) {
    numbers.push(grid[y][forward]);
    forward += 1;
  }

  return numbers.join("");
}

let sum = 0;

for (let row in grid) {
  for (let char in grid[row]) {
    if (isSymbol(grid[row][char])) {
      const coordinates = getSurroundingCoordinates(row, char);
      const numbers = [];

      coordinates.forEach(({ y, x }) => {
        const gridValue = grid[y][x];
        const parsedNumber = parseNumber(grid, y, x);
        if (isNumber(gridValue) && !numbers.includes(+parsedNumber)) {
          numbers.push(+parsedNumber);
        }
      });

      sum += numbers.reduce((acc, curr) => acc + curr, 0);
    }
  }
}

console.log(sum);
