var collect = require('function.collect');
var roleUpgrader = require('role.upgrader');

var roleDistributor = {
    run: function(creep) {

        if (creep.memory.working && creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            creep.memory.working = false;
            creep.memory.target = false;
        }

        if (!creep.memory.working && creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            creep.memory.working = true;
            creep.memory.target = false;
        }

        if (!creep.memory.working) {
            collect.fromStorage(creep);
            return;
        }

        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: structure =>
                (
                    structure.structureType === STRUCTURE_EXTENSION ||
                    structure.structureType === STRUCTURE_SPAWN ||
                    structure.structureType === STRUCTURE_TOWER
                ) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });

        if (targets.length) {
            const target = creep.pos.findClosestByRange(targets);

            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {
                    visualizePathStyle: { stroke: '#ffffff' }
                });
            }
        }
    }
};

module.exports = roleDistributor;
