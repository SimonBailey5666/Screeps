var collect = require('function.collect');

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
                    new RoomPosition(25, 25, creep.memory.work),
                    {reusePath: PATH_TICK_RECALC}
                );
            }
            else {
                if(!creep.memory.storage){

                    let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                                    filter: (structure) => structure.structureType === STRUCTURE_CONTAINER});

                    if(container){
                        creep.memory.storage = container.id;
                    }
                }
                let storage = Game.getObjectById(creep.memory.storage)

                if(storage?.store.getUsedCapacity(RESOURCE_ENERGY) > 0){
                    if(creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                        creep.moveTo(storage);
                    }
                    return;
                }
                collect.pickupEnergy(creep);
            }
            
        } 
        else {
            if(!common.inHomeRoom(creep) || common.atExit(creep.pos)){
                creep.moveTo(
                    new RoomPosition(25, 25, creep.memory.home),
                    {reusePath: PATH_TICK_RECALC}
                );
            } 
            else if (creep.store[RESOURCE_ENERGY] > 0) {
                
                if(!creep.memory.target){
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: structure =>
                            ((structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) ||
                            ((structure.structureType == STRUCTURE_STORAGE) && (_.sum(structure.store) < structure.storeCapacity))
                    });
                    creep.memory.target = common.setTarget(creep,targets);
                }
                //TODO: needs to search once and store target in memory
                if (creep.memory.target) {
                    var target = Game.getObjectById(creep.memory.target);
                    
                    if(!target){
                        delete creep.memory.target;
                        return;
                    }
                    if(target.store.getFreeCapacity(RESOURCE_ENERGY) === 0){
                        delete creep.memory.target;
                        return;
                    }
            
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
                        creep.moveTo(creep.room.storage, {reusePath: PATH_TICK_RECALC});
                    }
                }
            }
        }
    }
};

module.exports = roleHauler;