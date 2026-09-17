var collect = require('function.collect');

var roleDistributor = {
    run: function(creep) {

        if (creep.memory.working && creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            creep.memory.working = false;
        }

        if (!creep.memory.working && creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            creep.memory.working = true;
        }

        if (!creep.memory.working) {
            collect.fromStorage(creep);
            return;
        }

        if(!creep.memory.target){
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: structure =>
                    (
                        structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_TOWER
                    ) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });
            creep.memory.target = common.setTarget(creep, targets, false);
        }
        
        var target = Game.getObjectById(creep.memory.target);
        if(!target){
            delete creep.memory.target;
            return;
        }
        if(target.store.getFreeCapacity(RESOURCE_ENERGY) === 0){
            delete creep.memory.target;
            return;
        }
        
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {
                        visualizePathStyle: { stroke: '#ffffff' },
                        reusePath: PATH_TICK_RECALC
                    });
        }
        
    }
};

module.exports = roleDistributor;