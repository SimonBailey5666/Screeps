const spawnRules = {
    
    noMiners(tCreep) {
        return !Game.rooms[tCreep.locations.work].find(FIND_MY_CREEPS, {
            filter: creep => creep.memory.role === "miner"
        }).length;
    },

    noCreepsWithRole(tCreep) {
        return !Game.rooms[tCreep.locations.work].find(FIND_MY_CREEPS, {
            filter: creep => creep.memory.role === tCreep.role
        }).length;
    },

    hasMiners(tCreep, count = 1) {
        return Game.rooms[tCreep.locations.work].find(FIND_MY_CREEPS, {
            filter: creep => creep.memory.role === "miner"
        }).length >= count;
    },
    needsBuilder(tCreep) {
        if (Game.rooms[tCreep.locations.work].find(FIND_MY_CONSTRUCTION_SITES).length > 0) {
            return true;
        }

        // Any structures below 50% health?
        if(Game.rooms[tCreep.locations.work].find(FIND_STRUCTURES, {filter: structure =>structure.hits < structure.hitsMax * 0.5}).length > 0)
        {
            return true;
        }
        return false;
    },
    needsReplacement(tCreep, minimumAlive = 1, tickCount = 100) {
        
        const creeps = Object.values(Game.creeps).filter(creep =>creep.memory.work === tCreep.locations.work &&creep.memory.role === tCreep.role);
        const qPopulation = _.filter(Memory.rooms[tCreep.locations.home].spawnQueue,creep => creep.role === tCreep.role && creep.locations.work === tCreep.locations.work).length;
        // Not enough creeps alive
        
        if(creeps.length + qPopulation < minimumAlive){
            return true;
        }
        if(creeps.some(creep => creep.ticksToLive < tickCount)){
            return true;
        }
        return false;
        
    },
    enemiesPresent(tCreep){
        return Game.rooms[tCreep.locations.work].find(FIND_HOSTILE_CREEPS).length > 0;
    },
    safeModeActive(tCreep){
        return Game.rooms[tCreep.locations.work].controller?.safeMode
    },
    hasRoomVision(tCreep){
        return Gamep.rooms[tCreep.locations.work];
    }
};

module.exports = spawnRules;