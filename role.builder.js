var collect = require('function.collect');
var common = require('function.common');
var roleUpgrader = require('role.upgrader');
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('🚧 build');
        }

        if(creep.memory.working) {
            if(!common.inWorkRoom(creep) || common.atExit(creep.pos)){
                creep.moveTo(
                    new RoomPosition(25, 25, creep.memory.work)
                );
            } 
            else {
                var sites = creep.room.find(FIND_CONSTRUCTION_SITES);
                var target = creep.pos.findClosestByRange(sites);
                if(target) {
                    if(creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                else
                {
                    var targets = creep.room.find(FIND_STRUCTURES, {filter: object => object.hits < object.hitsMax});
                    targets.sort((a,b) => a.hits - b.hits);
                    if(targets.length > 0) {
                        if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0]);
                        }
                    }
                    else
                    {
                        roleUpgrader.run(creep);
                    }
                }
            }
        }
        else {
            if(!common.inHomeRoom(creep) || common.atExit(creep.pos)){
                creep.moveTo(
                    new RoomPosition(25, 25, creep.memory.home)
                );
            }
            else {
                const hasEnergyStorage = creep.room.find(FIND_STRUCTURES, {
                        filter: s =>
                            s.structureType === STRUCTURE_CONTAINER &&
                            s.store[RESOURCE_ENERGY] > 0
                }).length > 0;
                    
                if(hasEnergyStorage){
                    collect.fromStorage(creep);
                } 
                else{
                    collect.run(creep);
                }
            }
        }
    }
};

module.exports = roleBuilder;