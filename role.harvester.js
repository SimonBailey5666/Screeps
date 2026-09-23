var roleBuilder = require('role.builder');
var collect = require('function.collect');

var roleHarvester = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }
        
        if (!creep.memory.working) {
            collect.mine(creep);
        }
        else {
            if (creep.room.name !== creep.memory.home) {
                creep.moveTo(
                    new RoomPosition(25, 25, creep.memory.home)
                );
            }
            else {
                if (creep.store[RESOURCE_ENERGY] > 0) {
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
                    else {
                        roleBuilder.run(creep);
                    }
                }
            }
        }
    }
};

module.exports = roleHarvester;