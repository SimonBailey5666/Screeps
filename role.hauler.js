var collect = require('function.collect');

//Pickup dropped energy and put it into storage

var roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            if(creep.memory.storage){
                delete creep.memory.storage;
            }
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            if(creep.memory.target){
                delete creep.memory.target;
            }
        }

        if(!creep.memory.working) {
            if(!common.inWorkRoom(creep) || common.atExit(creep.pos)){
                creep.moveTo(
                    new RoomPosition(25, 25, creep.memory.work),
                    {reusePath: PATH_TICK_RECALC}
                );
            }
            else {
                this.findEnergy(creep);
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
                this.storeEnergy(creep)
            }
        }
    },

    storeEnergy: function(creep){
        if(!creep.memory.target){
            let targets = creep.room.find(FIND_STRUCTURES, {
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
    },

    findEnergy: function(creep){
        //If there is no storage targets set and there is no energy to pickup
        if(!collect.pickupEnergy(creep) && !creep.memory.storage){
            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: structure => (structure.structureType == STRUCTURE_CONTAINER) &&  
                (structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
            });
            
            if(targets.length>0){
                console.log("targets: " +targets);
                creep.memory.storage = common.setTarget(targets);
            }
        }

        //If we have a storage target
        if(creep.memory.storage){
            storage = Game.getObjectById(creep.memory.storage);
            if(!storage.getFreeCapacity > 0){
                delete creep.memory.storage;
            }

            if(creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                creep.moveTo(storage);
            }
        }
    }

};

module.exports = roleHauler;