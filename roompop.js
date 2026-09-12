//Room population settings
//Home Room -> Work Room -> Room population

const POPS = {
    W38S4: {
        harvester: {
            minCost: 200,
            maximumCost: 400,
            max: 6,
            spawnIf: room =>
                !room.find(FIND_MY_CREEPS, {
                    filter: creep => creep.memory.role === "miner"
                }).length
        },

        upgrader: {
            minCost: 550,
            maximumCost: 900,
            max: 2,
            spawnIf: room => true
        },

        builder: {
            minCost: 200,
            maximumCost: 900,
            max: 1,
            spawnIf: room => true
        },

        distributer: {
            minCost: 400,
            maximumCost: 900,
            max: 1,
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
            maximumCost: 600,
            max: 5,
            spawnIf: room => {
                return room.find(FIND_HOSTILE_CREEPS).length > 0;
            }
        },

        miner: {
            minCost: 450,
            maximumCost: 800,
            max: 2,
            spawnIf: room => {
                const harvesters = room.find(FIND_MY_CREEPS, {
                    filter: creep => creep.memory.role === "harvester"
                });

                const miners = room.find(FIND_MY_CREEPS, {
                    filter: creep => creep.memory.role === "miner"
                });

                return (
                    harvesters.length >= POPS[room.name].harvester.max ||
                    miners.length > 0
                );
            }
        },

        hauler: {
            minCost: 450,
            maximumCost: 800,
            max: 2,
            spawnIf: room => {
                const miners = room.find(FIND_MY_CREEPS, {
                    filter: creep => creep.memory.role === "miner"
                });

                return miners.length > 0;
            }
        }
    },

    W38S5: {
        miner: {
            minCost: 450,
            maximumCost: 800,
            max: 1
        },

        hauler: {
            minCost: 450,
            maximumCost: 600,
            max: 3
        },
        builder: {
            minCost: 450,
            maximumCost: 600,
            max: 1
        }
    },
    W37S4: {
        miner: {
            minCost: 450,
            maximumCost: 800,
            max: 1
        },
        hauler: {
            minCost: 450,
            maximumCost: 600,
            max: 3
        },
        builder: {
            minCost: 450,
            maximumCost: 600,
            max: 1
        }
    },
    W39S5: {
        miner: {
            minCost: 450,
            maximumCost: 800,
            max: 1
        },
        hauler: {
            minCost: 450,
            maximumCost: 600,
            max: 3
        }
    },
    W39S3: {
        defender: {
            minCost: 700,
            maximumCost: 700,
            max: 8
        }
    }
};

global.ROOMS = Object.keys(POPS);
global.POPS = POPS;

module.exports = POPS;
