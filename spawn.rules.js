const common = require("./function.common");

const spawnRules = {
    
    noMiners(tCreep) {
        if(!common.hasRoomVision(tCreep.locations.work)){
            return false;
        }

        return !Game.rooms[tCreep.locations.work].find(FIND_MY_CREEPS, {
            filter: creep => creep.memory.role === "miner"
        }).length;
    },

    noCreepsWithRole(tCreep) {
        if(!common.hasRoomVision(tCreep.locations.work)){
            return false;
        }

        return !Game.rooms[tCreep.locations.work].find(FIND_MY_CREEPS, {
            filter: creep => creep.memory.role === tCreep.role
        }).length;
    },

    hasMiners(tCreep, count = 1) {
        if(!common.hasRoomVision(tCreep.locations.work)){
            return false;
        }

        return Game.rooms[tCreep.locations.work].find(FIND_MY_CREEPS, {
            filter: creep => creep.memory.role === "miner"
        }).length >= count;
    },
    needsBuilder(tCreep) {

        if(!common.hasRoomVision(tCreep.locations.work)){
            return false;
        }

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
    needsReplacement(tCreep, minimumAlive = 1, tickCount = 120) {
        
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
    enemyTowersAreEmpty(tCreep) {

        if(!common.hasRoomVision(tCreep.locations.work)){
            return false;
        }

        room = Game.rooms[tCreep.locations.work];
        const towers = room.find(FIND_HOSTILE_STRUCTURES, {
            filter: structure => structure.structureType === STRUCTURE_TOWER
        });
    
        // True if there is at least one enemy tower and ALL are empty
        return towers.length > 0 &&
            towers.every(tower => tower.store[RESOURCE_ENERGY] === 0);
    },   
    enemiesPresent(tCreep, enemies = 1){
        
        if(!common.hasRoomVision(tCreep.locations.work)){
            return false;
        }

        const hostiles = Game.rooms[tCreep.locations.work].find(FIND_HOSTILE_CREEPS);

        return hostiles.filter(enemy => enemy.body.length > 2).length >= enemies;
    },
    safeModeActive(tCreep){
        if(!common.hasRoomVision(tCreep.locations.work)){
            return true;
        }

        return Game.rooms[tCreep.locations.work].controller?.safeMode
    },
    hasRoomVision(tCreep){
        return common.hasRoomVision(tCreep);
    }
};

module.exports = spawnRules;