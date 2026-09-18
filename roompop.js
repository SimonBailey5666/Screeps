const spawnRules = require("spawn.rules");

//Room population settings
//Home Room -> Work Room -> Room population

const POPS = {
    W38S4: {
        W38S4: {
            upgrader: {
                minCost: 800,
                maximumCost: 800,
                max: 2,
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
                max: 3,
                spawnIf: tCreep => spawnRules.needsReplacement(tCreep, 2)
            },
    
            defender: {
                minCost: 400,
                maximumCost: 600,
                max: 5,
                spawnIf: spawnRules.enemiesPresent
            },
    
            miner: {
                minCost: 550,
                maximumCost: 550,
                max: 2,
                spawnIf: tCreep => spawnRules.needsReplacement(tCreep, 1)
            },
    
            hauler: {
                minCost: 500,
                maximumCost: 600,
                max: 3,
                spawnIf:  tCreep => spawnRules.needsReplacement(tCreep, 2)
                
            }
        },
    
        W38S5: {
            miner: {
                minCost: 550,
                maximumCost: 550,
                max: 2,
                spawnIf: tCreep => spawnRules.needsReplacement(tCreep, 1, 130)
            },
    
            hauler: {
                minCost: 450,
                maximumCost: 600,
                max: 4,
                spawnIf: tCreep => spawnRules.needsReplacement(tCreep, 3)
            },
            builder: {
                minCost: 700,
                maximumCost: 700,
                max: 1,
                spawnIf: spawnRules.needsBuilder
            },
            defender: {
                minCost: 400,
                maximumCost: 600,
                max: 5,
                spawnIf: tCreep => spawnRules.enemiesPresent(tCreep)
            },
            capturer: {
                minCost: 1000,
                maximumCost: 1000,
                max: 1,
                spawnIf: tCreep => !spawnRules.enemiesPresent(tCreep) && spawnRules.needsReplacement(tCreep)
            }
        },

        W37S4: {
            miner: {
               minCost: 550,
                maximumCost: 550,
                max: 2,
                spawnIf: tCreep => spawnRules.needsReplacement(tCreep)
            },
            hauler: {
                minCost: 450,
                maximumCost: 600,
                max: 4,
                spawnIf: tCreep => spawnRules.needsReplacement(tCreep, 3)
            },
            builder: {
                minCost: 700,
                maximumCost: 700,
                max: 1,
                spawnIf: spawnRules.needsBuilder
            },
            defender: {
                minCost: 400,
                maximumCost: 600,
                max: 5,
                spawnIf: tCreep => spawnRules.enemiesPresent(tCreep)
            },
            capturer: {
                minCost: 1000,
                maximumCost: 1000,
                max: 1,
                spawnIf: tCreep => !spawnRules.enemiesPresent(tCreep) && spawnRules.needsReplacement(tCreep)
            }
        },

        W39S5: {
            miner: {
                minCost: 350,
                maximumCost: 350,
                max: 2,
                spawnIf: tCreep => spawnRules.needsReplacement(tCreep, 1, 200)
            },
            hauler: {
                minCost: 450,
                maximumCost: 600,
                max: 4,
                spawnIf: tCreep => spawnRules.needsReplacement(tCreep, 3)
            },
            builder: {
                minCost: 700,
                maximumCost: 700,
                max: 1,
                spawnIf: spawnRules.needsBuilder
            },
            defender: {
                minCost: 400,
                maximumCost: 600,
                max: 5,
                spawnIf: tCreep => spawnRules.enemiesPresent(tCreep, 2)
            }
        },

        W37S3: {
            miner: {
                minCost: 350,
                maximumCost: 350,
                max: 2,
                spawnIf: tCreep => spawnRules.needsReplacement(tCreep, 1, 200)
            },
            hauler: {
                minCost: 800,
                maximumCost: 800,
                max: 4,
                spawnIf: tCreep => spawnRules.needsReplacement(tCreep, 3)
            },
            builder: {
                minCost: 800,
                maximumCost: 800,
                max: 2,
                spawnIf: spawnRules.needsBuilder
            },
            defender: {
                minCost: 400,
                maximumCost: 600,
                max: 3,
                spawnIf: tCreep => spawnRules.enemiesPresent(tCreep)
            }
        },

        W39S3: {    //ATTACK THIS ROOM
            defender: {
                minCost: 1000,
                maximumCost: 1000,
                max: 8,
                spawnIf: tCreep => !spawnRules.safeModeActive(tCreep) && spawnRules.enemyTowersAreEmpty(tCreep)
            },
            scout: {
                minCost: 50,
                maximumCost: 50,
                max: 0,
                spawnif: !spawnRules.hasRoomVision
            },
            capturer: {
                minCost: 1000,
                maximumCost: 1000,
                max: 0,
                spawnIf: tCreep => !spawnRules.enemiesPresent(tCreep) && spawnRules.needsReplacement
            }, 
            healer: {
                minCost: 900,
                maximumCost: 900,
                max: 6,
                spawnIf: tCreep => spawnRules.needsReplacement(tCreep, 3, 200)
            },
            tank: {
                minCost: 800,
                maximumCost: 850,
                max: 2,
                spawnIf: tCreep => spawnRules.needsReplacement(tCreep, 1, 270)
            }

        },
        
        W37S5: {    //ATTACK THIS ROOM
            defender: {
                minCost: 1000,
                maximumCost: 1000,
                max: 8,
                spawnIf: tCreep => !spawnRules.safeModeActive && spawnRules.enemyTowersAreEmpty
            },
            scout: {
                minCost: 50,
                maximumCost: 50,
                max: 0,
                spawnif: !spawnRules.hasRoomVision
            },
            capturer: {
                minCost: 1000,
                maximumCost: 1000,
                max: 0,
                spawnIf: tCreep => !spawnRules.enemiesPresent(tCreep) && spawnRules.needsReplacement
            }, 
            healer: {
                minCost: 900,
                maximumCost: 900,
                max: 0,
                spawnIf: tCreep => spawnRules.needsReplacement(tCreep, 3, 200)
            },
            tank: {
                minCost: 800,
                maximumCost: 850,
                max: 0,
                spawnIf: tCreep => spawnRules.needsReplacement(tCreep, 1, 270)
            }
        },
         W38S2: {    //ATTACK THIS ROOM
            defender: {
                minCost: 1000,
                maximumCost: 1000,
                max: 8,
                spawnIf: tCreep => spawnRules.needsReplacement(tCreep, 4, 400)
            },
            scout: {
                minCost: 50,
                maximumCost: 50,
                max: 0,
                spawnif: !spawnRules.hasRoomVision
            },
            capturer: {
                minCost: 1000,
                maximumCost: 1000,
                max: 2,
                spawnIf: tCreep =>  spawnRules.needsReplacement(tCreep, 1, 250)
            }
        }
    }
    //Add new home rooms here
};

global.ROOMS = Object.keys(POPS);
global.POPS = POPS;

module.exports = POPS;
