const spawnRules = require("spawn.rules");

//Room population settings
//Home Room -> Work Room -> Room population

const POPS = {
    W38S4: {
        W38S4: {
            upgrader: {
                minCost: 800,
                maximumCost: 800,
                max: 1
            },
            builder: {
                minCost: 500,
                maximumCost: 600,
                max: 1,
                spawnIf: spawnRules.needsBuilder
            },
    
            distributer: {
                minCost: 200,
                maximumCost: 900,
                max: 3,
                spawnIf: tCreep => spawnRules.needsReplacement(tCreep, 2)
            },
    
            defender: {
                minCost: 400,
                maximumCost: 600,
                max: 0,
                spawnIf: spawnRules.enemiesPresent
            },
    
            miner: {
                minCost: 600,
                maximumCost: 600,
                max: 2,
                spawnIf: tCreep => spawnRules.needsReplacement(tCreep, 1)
            },
    
            hauler: {
                minCost: 1000,
                maximumCost: 1000,
                max: 2,
                spawnIf:  tCreep => spawnRules.needsReplacement(tCreep, 1)
                
            }
        },
    
        W38S5: {
            miner: {
                minCost: 600,
                maximumCost: 600,
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
                max: 4,
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
               minCost: 600,
                maximumCost: 600,
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
                max: 4,
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
                minCost: 400,
                maximumCost: 400,
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
                max: 4,
                spawnIf: tCreep => spawnRules.enemiesPresent(tCreep, 2)
            }
        },

        W37S3: {
            miner: {
                minCost: 400,
                maximumCost: 400,
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
                max: 4,
                spawnIf: tCreep => spawnRules.enemiesPresent(tCreep)
            }
        },

        W39S3: {    //SUPPLY THIS ROOM
            defender: {
                minCost: 1000,
                maximumCost: 1000,
                max: 0,
                spawnIf: tCreep => !spawnRules.enemiesPresent(tCreep)
            }

        },
        
        W37S5: {    //ATTACK THIS ROOM
            defender: {
                minCost: 1000,
                maximumCost: 1000,
                max: 0,
                spawnIf: tCreep => !spawnRules.safeModeActive(tCreep) && spawnRules.enemyTowersAreEmpty(tCreep)
            },
            scout: {
                minCost: 50,
                maximumCost: 50,
                max: 0,
                spawnIf: !spawnRules.hasRoomVision
            },
            capturer: {
                minCost: 1000,
                maximumCost: 1000,
                max: 0,
                spawnIf: tCreep => !spawnRules.roomControlledByEnemy(tCreep)
            }, 
            healer: {
                minCost: 900,
                maximumCost: 900,
                max: 0,
                spawnIf: tCreep => spawnRules.enemyTowersAreEmpty(tCreep)
            },
            tank: {
                minCost: 800,
                maximumCost: 850,
                max: 0,
                spawnIf: tCreep => spawnRules.enemyTowersAreEmpty(tCreep)
            }
        },
         W38S2: {    //ATTACK THIS ROOM
            defender: {
                minCost: 1000,
                maximumCost: 1000,
                max: 0,
                spawnIf: tCreep => spawnRules.needsReplacement(tCreep, 4, 400)
            },
            scout: {
                minCost: 50,
                maximumCost: 50,
                max: 1,
                spawnIf: !spawnRules.hasRoomVision
            },
            capturer: {
                minCost: 1000,
                maximumCost: 1000,
                max: 1,
                spawnIf: tCreep =>  !spawnRules.roomControlledByEnemy(tCreep)
            }
        },
        W37S3: {    //ATTACK THIS ROOM
            defender: {
                minCost: 800,
                maximumCost: 800,
                max: 4,
                spawnIf: spawnRules.enemiesPresent
            },
            scout: {
                minCost: 50,
                maximumCost: 50,
                max: 1,
                spawnIf: !spawnRules.hasRoomVision
            }
        },
        W38S3: {    //ATTACK THIS ROOM
            defender: {
                minCost: 800,
                maximumCost: 800,
                max: 4,
                spawnIf: spawnRules.enemiesPresent
            },
            scout: {
                minCost: 50,
                maximumCost: 50,
                max: 1,
                spawnIf: !spawnRules.hasRoomVision
            }
        }
    },
    W39S3: {  //new room
        W39S3: { 
            builder: {
                minCost: 300,
                maximumCost: 400,
                max: 2

            },
            miner: {
                minCost: 400,
                maximumCost: 600,
                max: 4,
                spawnIf: tCreep => spawnRules.needsReplacement(tCreep, 2)

            },
            hauler: {
                minCost: 400,
                maximumCost: 800,
                max: 4,
                spawnIf: tCreep => spawnRules.needsReplacement(tCreep, 2)

            },
            upgrader: {
                minCost: 600,
                maximumCost: 800,
                max: 4
            }
        }
    }
    //Add new home rooms here
};

global.ROOMS = Object.keys(POPS);
global.POPS = POPS;

module.exports = POPS;
