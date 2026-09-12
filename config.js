//Defines creep types and pop
global.ROLES = ["harvester", "upgrader", "builder", "distributer", "defender", "miner", "hauler"];

//weighted parts
global.TEMPLATES = {
    harvester: {
        parts: [3, 2, 2, 0, 0, 0, 0, 0]
    },
    upgrader: {
        parts: [2, 3, 3, 0, 0, 0, 0, 0]
    },
    builder: {
        parts: [1, 2, 2, 0, 0, 0, 0, 0]
    },
    distributer: {
        parts: [1, 2, 2, 0, 0, 0, 0, 0]
    },
    defender: {
        parts: [0, 1, 0, 1, 0, 0, 0, 1]
    },
    miner: {
        parts: [5, 2, 0, 0, 0, 0, 0, 0]
    },
    hauler: {
        parts: [0, 1, 2, 0, 0, 0, 0, 0]
    }
};

//parts = [ WORK, MOVE, CARRY, ATTACK, RANGED_ATTACK, HEAL, CLAIM, TOUGH];


//Magic numbers
global.PATH_TICK_RECALC = 5; //Ticks before recalculating path
global.DEBUG_OUT = false;
