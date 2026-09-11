//Defines creep types and pop
global.ROLES = ["harvester", "upgrader", "builder", "distributer", "defender", "miner", "hauler"];

//weighted parts
global.TEMPLATES = {
    harvester: {
        minCost: 200,
        maximumCost: 400,
        max: 6,
        parts: [3, 2, 2, 0, 0, 0, 0, 0],
        spawnIf: room => !room.find(FIND_MY_CREEPS, {
            filter: creep => creep.memory.role === "miner"
            }).length
    },
    upgrader: {
        minCost: 550,
        maximumCost: 600,
        max: 2,
        parts: [2, 3, 3, 0, 0, 0, 0, 0],
        spawnIf: room => true
    },
    builder: {
        minCost: 200,
        maximumCost: 400,
        max: 2,
        parts: [1, 2, 2, 0, 0, 0, 0, 0],
        spawnIf: room => true
    },
    distributer: {
        minCost: 400,
        maximumCost: 400,
        max: 2,
        parts: [1, 2, 2, 0, 0, 0, 0, 0],
        spawnIf: room => {
            const containers = room.find(FIND_STRUCTURES, {
                filter: s =>
                    s.structureType === STRUCTURE_CONTAINER &&
                    s.store[RESOURCE_ENERGY] > 0
            });

            const needsEnergy = room.find(FIND_STRUCTURES, {
                filter: s =>
                    (s.structureType === STRUCTURE_SPAWN ||
                     s.structureType === STRUCTURE_EXTENSION) &&
                    s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });

            return containers.length > 0 && needsEnergy.length > 0;
        }
    },
    defender: {
        minCost: 400,
        maximumCost: 400,
        max: 5,
        parts: [0, 1, 0, 1, 0, 0, 0, 1],
        spawnIf: room => {
            room.find(FIND_HOSTILE_CREEPS).length > 0
        }
    },
    miner: {
        minCost: 450,
        maximumCost: 900,
        max: 2,
        parts: [5, 2, 0, 0, 0, 0, 0, 0],
        spawnIf: room => {
            const harvesters = room.find(FIND_MY_CREEPS, {
                filter: creep => creep.memory.role === "harvester"
            });
            
            const miners = room.find(FIND_MY_CREEPS, {
                filter: creep => creep.memory.role === "miner"
            });
            if ((harvesters.length >= TEMPLATES.harvester.max) || (miners.length > 0)){
                return true;   
            }
        }
    },
    hauler: {
        minCost: 450,
        maximumCost: 800,
        max: 2,
        parts: [0, 1, 2, 0, 0, 0, 0, 0],
        spawnIf: room => {
            const miners = room.find(FIND_MY_CREEPS, {
                filter: creep => creep.memory.role === "miner"
            });
    
            return miners.length > 0;
        }
    }
};

//parts = [ WORK, MOVE, CARRY, ATTACK, RANGED_ATTACK, HEAL, CLAIM, TOUGH];


//Magic numbers
global.PATH_TICK_RECALC = 5; //Ticks before recalculating path
global.DEBUG_OUT = false;
