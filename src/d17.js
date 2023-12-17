const fs = require("fs");

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d17.txt", {
        encoding: "utf-8"
    });
    return fileBuffer
        .trim()
        .split("\r\n")
        .map((row) => row.trim().split("").map(Number));
}

const grid = readValuesFromFile();
const vertices = [];
const adjacencyList = new Map();
const heatLossMap = new Map();
const parents = new Map();
const visited = new Set();

function addVertex(vertexKey) {
    vertices.push(vertexKey);
    adjacencyList.set(vertexKey, new Map());
}

function addEdge(vertex1Key, vertex2Key, weight) {
    if (!adjacencyList.has(vertex1Key)) {
        adjacencyList.set(vertex1Key, new Map([[vertex2Key, weight]]));
    } else {
        adjacencyList.get(vertex1Key).set(vertex2Key, weight);
    }
}

function getKey(location) {
    return JSON.stringify(location);
}

function getNeighbors(currentVertex, previousVertex) {
    return new Map([...adjacencyList.get(currentVertex)].filter((k, v) => k !== previousVertex));
}

function dijkstra(start) {
    for (let i = 0; i < vertices.length; i++) {
        if (vertices[i] === getKey(start)) {
            heatLossMap.set(getKey(start), 0);
        } else {
            heatLossMap.set(vertices[i], Infinity);
        }
        parents.set(vertices[i], null);
    }

    let currentVertex = vertexWithMinHeatLoss(heatLossMap, visited);
    let previousVertex;

    while (currentVertex !== null) {
        const heatLoss = heatLossMap.get(currentVertex);
        const neighbors = getNeighbors(currentVertex, previousVertex);

        for (const [neighborKey, weight] of Array.from(neighbors.entries())) {
            const newHeatLoss = heatLoss + weight;

            if (heatLossMap.get(neighborKey) > newHeatLoss) {
                heatLossMap.set(neighborKey, newHeatLoss);
                parents.set(neighborKey, currentVertex);
            }
        }
        visited.add(currentVertex);
        previousVertex = currentVertex;
        currentVertex = vertexWithMinHeatLoss(heatLossMap, visited);
    }

    return Array.from(heatLossMap.values()).pop();
}

function vertexWithMinHeatLoss(heatLossMap, visited) {
    let minHeatLoss = Infinity;
    let minVertex = null;

    for (const vertex of Array.from(heatLossMap.keys())) {
        const heatLoss = heatLossMap.get(vertex);
        if (heatLoss < minHeatLoss && !visited.has(vertex)) {
            minHeatLoss = heatLoss;
            minVertex = vertex;
        }
    }
    return minVertex;
}

function addVertexesAndEdges() {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            const vertexKey = getKey({ y, x });
            addVertex(vertexKey);
            // add all neighbors as edges
            if (y > 0) {
                addEdge(vertexKey, getKey({ y: y - 1, x }), grid[y - 1][x]);
            }
            if (x > 0) {
                addEdge(vertexKey, getKey({ y, x: x - 1 }), grid[y][x - 1]);
            }
            if (y < grid.length - 1) {
                addEdge(vertexKey, getKey({ y: y + 1, x }), grid[y + 1][x]);
            }
            if (x < grid[0].length - 1) {
                addEdge(vertexKey, getKey({ y, x: x + 1 }), grid[y][x + 1]);
            }
        }
    }
}

function calculatePart1() {
    addVertexesAndEdges();

    const start = { y: 0, x: 0 };
    return dijkstra(start);
}

function calculatePart2() {}

console.time("execution time");
const part1Result = calculatePart1();
// const part2Result = calculatePart2();
console.timeEnd("execution time");
console.log("part 1:", part1Result); //
// console.log("part 2:", part2Result); //
//
