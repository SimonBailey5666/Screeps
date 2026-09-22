var collect = require('function.collect');
var roleUpgrader = require('role.upgrader');
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
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
                    if(!creep.memory.repairTarget){
                        let targets = creep.room.find(FIND_STRUCTURES, {filter: object => object.hits < object.hitsMax && object.structureType !== STRUCTURE_WALL && object.structureType !== STRUCTURE_RAMPART});
                        if(!targets){
                            targets = creep.room.find(FIND_STRUCTURES, {filter: structure => (structure.hits < 100000 && (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART))})
                        }
                        targets.sort((a, b) => (a.hits / a.hitsMax) - (b.hits / b.hitsMax));
                        creep.memory.repairTarget = common.setTarget(creep, targets);
                    }
                    
                    let repairTarget = Game.getObjectById(creep.memory.repairTarget)
                    if(repairTarget){
                        if((repairTarget.structureType === STRUCTURE_WALL || repairTarget.structureType === STRUCTURE_RAMPART) && repairTarget.hits < 100000) {
                            let result = creep.repair(repairTarget) 
                            if(result == ERR_NOT_IN_RANGE) {
                                creep.moveTo(repairTarget);
                            }
                        }
                        else if(repairTarget.hits < repairTarget.hitsMax){
                            let result = creep.repair(repairTarget) 
                            if(result == ERR_NOT_IN_RANGE) {
                                creep.moveTo(repairTarget);
                            }
                        }
                        else {
                            delete creep.memory.repairTarget;
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
                    
                if(common.hasEnergyStorage(creep.room)){
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