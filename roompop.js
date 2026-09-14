const spawnRules = require("spawn.rules");

//Room population settings
//Home Room -> Work Room -> Room population

const POPS = {
    W38S4: {
        upgrader: {
            minCost: 500,
            maximumCost: 600,
            max: 1,
            spawnIf: room => true
        },

        builder: {
            minCost: 500,
            maximumCost: 600,
            max: 1,
            spawnIf: spawnRules.needsBuilder
        },

        distributer: {
            minCost: 700,
            maximumCost: 900,
            max: 2,
            spawnIf: spawnRules.needsReplacement
        },

        defender: {
            minCost: 400,
            maximumCost: 600,
            max: 5,
            spawnIf: spawnRules.enemiesPresent
        },

        miner: {
            minCost: 500,
            maximumCost: 600,
            max: 3,
            spawnIf: room => spawnRules.needsReplacement(room, 'miner', 2, 30)
        },

        hauler: {
            minCost: 500,
            maximumCost: 600,
            max: 3,
            spawnIf:  room => spawnRules.needsReplacement(room, 'hauler', 2, 30)
            
        }
    },

    W38S5: {
        miner: {
            minCost: 450,
            maximumCost: 600,
            max: 2,
            spawnIf: room => spawnRules.needsReplacement(room, 'miner', 1, 130)
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
            max: 3,
            spawnIf: room => spawnRules.needsReplacement(room, 'hauler', 2)
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
            spawnIf: room => spawnRules.needsReplacement(room, 'miner', 1, 180)
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
