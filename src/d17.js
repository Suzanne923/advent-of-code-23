const fs = require("fs");
const { PriorityQueue } = require("./utils/priority-queue");

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

function getIndex(location) {
    return location[0] * grid[0].length + location[1];
}

function mapNeighborToNode(node, neighbor) {
    return {
        index: getIndex(neighbor.position),
        position: neighbor.position,
        parent: node,
        neighbors: getNeighbors(neighbor.position),
        distance: neighbor.distance + node.distance,
        direction: neighbor.direction,
        forwardSteps: node.direction === neighbor.direction ? node.forwardSteps + 1 : 1
    };
}

function getValidNeighbors(node, evaluateFunc) {
    let validNeighbors = getNeighbors(node.position, node.direction);
    return validNeighbors.map((neighbor) => mapNeighborToNode(node, neighbor)).filter(evaluateFunc);
}

function getNeighbors([y, x], direction) {
    const neighbors = [];
    if (direction === "U" || direction === "D") {
        neighbors.push(
            { position: [y, x - 1], direction: "L", distance: undefined },
            { position: [y, x + 1], direction: "R", distance: undefined }
        );
        if (direction === "U") {
            neighbors.push({ position: [y - 1, x], direction: "U", distance: undefined });
        } else {
            neighbors.push({ position: [y + 1, x], direction: "D", distance: undefined });
        }
    } else {
        neighbors.push(
            { position: [y - 1, x], direction: "U", distance: undefined },
            { position: [y + 1, x], direction: "D", distance: undefined }
        );
        if (direction === "L") {
            neighbors.push({ position: [y, x - 1], direction: "L", distance: undefined });
        } else {
            neighbors.push({ position: [y, x + 1], direction: "R", distance: undefined });
        }
    }
    return neighbors
        .filter(
            (nb) =>
                nb.position[0] >= 0 &&
                nb.position[0] < grid.length &&
                nb.position[1] >= 0 &&
                nb.position[1] < grid[0].length
        )
        .map((nb) => {
            nb.distance = grid[nb.position[0]][nb.position[1]];
            return nb;
        });
}

function pushNodes(queue, start, startDirection) {
    const node = {
        index: getIndex(start),
        position: start,
        parent: null,
        direction: startDirection,
        forwardSteps: 1,
        distance: 0
    };
    queue.push(node);
}

function compareNodes(a, b) {
    return a.distance < b.distance;
}

function dijkstra(start, finish, evaluateFunc, startDirection) {
    const nodes = new PriorityQueue(compareNodes);
    const visited = new Map();

    pushNodes(nodes, start, startDirection);

    let best = null;
    while (!nodes.isEmpty()) {
        const node = nodes.pop();
        if (node.position[0] === finish[0] && node.position[1] === finish[1]) {
            best = node;
            break;
        }

        const visitedNode = visited.get(`${node.index}|${node.direction}|${node.forwardSteps}`);
        if (visitedNode != null) {
            if (node.distance >= visitedNode) {
                continue;
            }
        }
        visited.set(`${node.index}|${node.direction}|${node.forwardSteps}`, node.distance);
        const validNeighborNodes = getValidNeighbors(node, evaluateFunc);
        nodes.push(...validNeighborNodes);
    }

    return best.distance;
}

function calculatePart1() {
    const start = [0, 0];
    const finish = [grid.length - 1, grid[0].length - 1];
    const evaluateFunc = (nb) => nb.forwardSteps <= 3;
    return dijkstra(start, finish, evaluateFunc, "D");
}

function calculatePart2() {
    const start = [0, 0];
    const finish = [grid.length - 1, grid[0].length - 1];
    const evaluateFunc = (nb) => {
        if (nb.forwardSteps > 10) {
            return false
        }
        if (nb.parent.forwardSteps < 4 && nb.forwardSteps === 1) {
            return false
        }
        return true
    }
    return dijkstra(start, finish, evaluateFunc, "R");
}

console.time("execution time");
const part1Result = calculatePart1();
const part2Result = calculatePart2();
console.timeEnd("execution time");
console.log("part 1:", part1Result); // 1008
console.log("part 2:", part2Result); // 1210
// 3.897s
