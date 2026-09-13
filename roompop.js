const spawnRules = require("spawn.rules");

//Room population settings
//Home Room -> Work Room -> Room population

const POPS = {
    W38S4: {
        upgrader: {
            minCost: 700,
            maximumCost: 1200,
            max: 2,
            spawnIf: room => true
        },

        builder: {
            minCost: 700,
            maximumCost: 1000,
            max: 2,
        },

        distributer: {
            minCost: 300,
            maximumCost: 300,
            max: 2,
        },

        defender: {
            minCost: 400,
            maximumCost: 600,
            max: 5,
            spawnIf: room => {
                return room.find(FIND_HOSTILE_CREEPS).length > 0;
            }
        },

        miner: {
            minCost: 800,
            maximumCost: 1000,
            max: 2,
            spawnIf: room => spawnRules.needsReplacement(room, 'miner')
        },

        hauler: {
            minCost: 800,
            maximumCost: 1000,
            max: 2,
            spawnIf:  room => spawnRules.needsReplacement(room, 'hauler')
            
        }
    },

    W38S5: {
        miner: {
            minCost: 450,
            maximumCost: 600,
            max: 2,
            spawnIf: room => spawnRules.needsReplacement(room, 'miner')
        },

        hauler: {
            minCost: 450,
            maximumCost: 600,
            max: 4,
            spawnIf: room => spawnRules.needsReplacement(room, 'hauler', 3)
        },
        builder: {
            minCost: 450,
            maximumCost: 600,
            max: 2,
            spawnIf: spawnRules.needsBuilder
        }
    },
    W37S4: {
        miner: {
            minCost: 450,
            maximumCost: 600,
            max: 2,
            spawnIf: room => spawnRules.needsReplacement(room, 'miner')
        },
        hauler: {
            minCost: 450,
            maximumCost: 600,
            max: 4,
            spawnIf: room => spawnRules.needsReplacement(room, 'hauler', 3)
        },
        builder: {
            minCost: 450,
            maximumCost: 600,
            max: 2,
            spawnIf: spawnRules.needsBuilder
        }
    },
    W39S5: {
        miner: {
            minCost: 450,
            maximumCost: 800,
            max: 2,
            spawnIf: room => spawnRules.needsReplacement(room, 'miner', 1, 120)
        },
        hauler: {
            minCost: 450,
            maximumCost: 600,
            max: 5,
            spawnIf: room => spawnRules.needsReplacement(room, 'hauler', 4)
        },
        builder: {
            minCost: 600,
            maximumCost: 600,
            max: 2,
            spawnIf: spawnRules.needsBuilder
        }
    },
    W37S5: {
        defender: {
            minCost: 700,
            maximumCost: 700,
            max: 0
        }
    }
};

global.ROOMS = Object.keys(POPS);
global.POPS = POPS;

module.exports = POPS;
