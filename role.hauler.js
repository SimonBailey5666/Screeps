var collect = require('function.collect');
var common = require('function.common');

//Pickup dropped energy and put it into storage

var roleHauler = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }
        
        if(!creep.memory.working) {
            if(!common.inWorkRoom(creep) || common.atExit(creep.pos)){
                creep.moveTo(
                    new RoomPosition(25, 25, creep.memory.work)
                );
            }
            else {
                collect.pickupEnergy(creep);
            }
            
        } 
        else {
            if(!common.inHomeRoom(creep) || common.atExit(creep.pos)){
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
                        ((structure.structureType == STRUCTURE_CONTAINER) && (_.sum(structure.store) < structure.storeCapacity)) ||
                        ((structure.structureType == STRUCTURE_STORAGE) && (_.sum(structure.store) < structure.storeCapacity))
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
    }
};

module.exports = roleHauler;