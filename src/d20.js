const fs = require("fs");

function readValuesFromFile() {
    const fileBuffer = fs.readFileSync("../inputs/d20.txt", {
        encoding: "utf-8"
    });
    return fileBuffer.trim().split("\r\n");
}
const input = readValuesFromFile();
const queue = [];
let highs = 0;
let lows = 0;
let buttonPresses = 0;
const modulesNeededForP2 = {};

class Module {
    receivers = [];
    constructor(name) {
        this.name = name;
    }
}

class Broadcaster extends Module {
    broadcast() {
        sendPulses(this.receivers, this.name, "l");
    }
}

class FlipFlop extends Module {
    isOn = false;

    receivePulse(pulse, sender) {
        if (pulse !== "h") {
            this.isOn = !this.isOn;
            if (this.isOn) {
                sendPulses(this.receivers, this.name, "h");
            } else {
                sendPulses(this.receivers, this.name, "l");
            }
        }
    }
}

class Conjunction extends Module {
    inputs = new Map();
    isHigh = () => Array.from(this.inputs.values()).every((m) => m === "h");

    receivePulse(pulse, sender) {
        this.inputs.set(sender, pulse);

        if (this.isHigh()) {
            sendPulses(this.receivers, this.name, "l");
        } else {
            sendPulses(this.receivers, this.name, "h");
        }
    }
}

function sendPulses(receivers, senderName, pulse) {
    receivers.forEach((d) =>
        queue.push({
            pulse,
            senderName,
            receiver: d
        })
    );
}

function setReceivers(module, receivers, modules) {
    receivers.forEach((name) => {
        const receiver = modules.get(name);
        module.receivers.push(receiver);
        if (receiver instanceof Conjunction) {
            receiver.inputs.set(module, "l");
        }
        if (name === "qt") {
            modulesNeededForP2[module.name] = [];
        }
    });
}

function createModule(name) {
    if (name[0] === "%") {
        return new FlipFlop(name.substring(1));
    } else if (name[0] === "&") {
        return new Conjunction(name.substring(1));
    } else if (name === "broadcaster") {
        return new Broadcaster(name);
    }
}

function setupModules() {
    const modules = new Map();
    for (const line of input) {
        const [key, _] = line.split(" -> ");
        const name = key === "broadcaster" ? key : key.substring(1);
        modules.set(name, createModule(key));
    }
    modules.set("rx", new FlipFlop("rx"));
    for (const line of input) {
        const [key, types] = line.split(" -> ");
        const receivers = types.split(", ");
        const name = key === "broadcaster" ? key : key.substring(1);
        setReceivers(modules.get(name), receivers, modules);
    }
    return modules;
}

function pulsepulse(pulse) {
    if (pulse === "l") {
        lows += 1;
    } else {
        highs += 1;
    }
}

function pushButton(modules) {
    buttonPresses++;
    pulsepulse("l");
    while (queue.length > 0) {
        const { pulse, senderName, receiver } = queue.shift();
        pulsepulse(pulse);
        receiver.receivePulse(pulse, modules.get(senderName));
        if (receiver.name in modulesNeededForP2 && pulse === "l") {
            modulesNeededForP2[receiver.name].push(buttonPresses);
        }
    }
}

function lcd() {
    const gcd = (a, b) => (a ? gcd(b % a, a) : b);
    const lcd = (a, b) => (a * b) / gcd(a, b);
    return lcd;
}

function calculatePart1() {
    const modules = setupModules();
    const start = modules.get("broadcaster");

    for (let i = 0; i < 1000; i++) {
        start.broadcast();
        pushButton(modules);
    }

    return lows * highs;
}

function calculatePart2() {
    const modules = setupModules();
    const start = modules.get("broadcaster");

    while (true) {
        start.broadcast();
        pushButton(modules);

        if (Object.values(modulesNeededForP2).every(m => m.length === 2)) {
            break;
        }
    }

    return Object.values(modulesNeededForP2).map(([c1, c2]) => c2 - c1).reduce(lcd(), 1);
}

console.time("execution time");
const part1Result = calculatePart1();
const part2Result = calculatePart2();
console.timeEnd("execution time");
console.log("part 1:", part1Result); // 879834312
console.log("part 2:", part2Result); // 243037165713371
// 100.785ms
