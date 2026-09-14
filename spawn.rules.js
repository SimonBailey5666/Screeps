const spawnRules = {
    
    noMiners(room) {
        return !room.find(FIND_MY_CREEPS, {
            filter: creep => creep.memory.role === "miner"
        }).length;
    },

    noCreepsWithRole(room, role) {
        return !room.find(FIND_MY_CREEPS, {
            filter: creep => creep.memory.role === role
        }).length;
    },

    hasMiners(room, count = 1) {
        return room.find(FIND_MY_CREEPS, {
            filter: creep => creep.memory.role === "miner"
        }).length >= count;
    },
    needsBuilder(room) {
        if (room.find(FIND_MY_CONSTRUCTION_SITES).length > 0) {
            return true;
        }

        // Any structures below 50% health?
        if(room.find(FIND_STRUCTURES, {filter: structure =>structure.hits < structure.hitsMax * 0.5}).length > 0)
        {
            return true;
        }
        return false;
    },  //TODO: Needs improvement for multiroom spawning
    needsReplacement(room, role, minimumAlive = 1, tickCount = 100) {
        
        const creeps = Object.values(Game.creeps).filter(creep =>creep.memory.work === room.name &&creep.memory.role === role);
        const qPopulation = _.filter(Memory.rooms['W38S4'].spawnQueue,creep => creep.role === role && creep.locations.work === room.name).length;
        // Not enough creeps alive
        
        if(creeps.length + qPopulation < minimumAlive){
            return true;
        }
        if(creeps.some(creep => creep.ticksToLive < tickCount)){
            return true;
        }
        return false;
        
    },
    enemiesPresent(room){
        return room.find(FIND_HOSTILE_CREEPS).length > 0;
    }
};

module.exports = spawnRules;