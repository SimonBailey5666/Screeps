var collect = require('function.collect');

//Pickup dropped energy and put it into storage

var roleHauler = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('🔄 Pickup');
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('Store');
        }
        
        if(!creep.memory.working) {
            //***FIX THIS***
            if(creep.memory.work){
                if(creep.room.name !== creep.memory.work || this.isAtExit(creep.pos)){
                    creep.moveTo(
                        new RoomPosition(25, 25, creep.memory.work)
                    );
                }
                else {
                    collect.pickupEnergy(creep);
                }
            }
            else {
                collect.pickupEnergy(creep);
            }
        } 
        else {
            if(creep.room.name !== creep.memory.home || this.isAtExit(creep.pos)){
                creep.moveTo(
                    new RoomPosition(25, 25, creep.memory.home)
                );
            } 
            else if (creep.store[RESOURCE_ENERGY] > 0) {
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: structure =>
                            ((structure.structureType == STRUCTURE_EXTENSION ||
                             structure.structureType == STRUCTURE_SPAWN ||
                             structure.structureType == STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) || 
                            ((structure.structureType == STRUCTURE_CONTAINER) && (_.sum(structure.store) < structure.storeCapacity))
                    });
                
                    if (targets.length > 0) {
                        var target = creep.pos.findClosestByRange(targets);
                
                        var result = creep.transfer(target, RESOURCE_ENERGY);
                
                        if (result == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                    }
                    else if (creep.room.storage) {
                        var result = creep.transfer(
                            creep.room.storage,
                            RESOURCE_ENERGY
                        );
                
                        if (result == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.storage);
                        }
                    }
            }
        }
    },
    isAtExit: function(pos) {
        return pos.x === 0 || pos.x === 49 || pos.y === 0 || pos.y === 49 || pos.x === 1 || pos.x === 48 || pos.y === 1 || pos.y === 48;
    }
};

module.exports = roleHauler;