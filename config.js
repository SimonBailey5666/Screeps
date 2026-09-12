//Defines creep types and pop
global.ROLES = ["harvester", "upgrader", "builder", "distributer", "defender", "miner", "hauler"];

//weighted parts
global.TEMPLATES = {
    harvester: {
        parts: [3, 2, 2, 0, 0, 0, 0, 0],
        priority: 5
    },
    upgrader: {
        parts: [2, 3, 3, 0, 0, 0, 0, 0],
        priority: 7
    },
    builder: {
        parts: [1, 2, 2, 0, 0, 0, 0, 0],
        priority: 3
    },
    distributer: {
        parts: [1, 3, 3, 0, 0, 0, 0, 0],
        priority: 3
    },
    defender: {
        parts: [0, 2, 0, 0, 1, 0, 0, 2],
        priority: 4
    },
    miner: {
        parts: [5, 2, 0, 0, 0, 0, 0, 0],
        priority: 1
    },
    hauler: {
        parts: [0, 1, 2, 0, 0, 0, 0, 0],
        priority: 2
    }
};

//parts = [ WORK, MOVE, CARRY, ATTACK, RANGED_ATTACK, HEAL, CLAIM, TOUGH];


//Magic numbers
global.PATH_TICK_RECALC = 5; //Ticks before recalculating path
global.DEBUG_OUT = false;
