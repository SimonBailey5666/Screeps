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
                    var targets = creep.room.find(FIND_STRUCTURES, {filter: object => object.hits < object.hitsMax && object.structureType !== STRUCTURE_WALL});
                    targets.sort((a, b) => (a.hits / a.hitsMax) - (b.hits / b.hitsMax));
                    if(targets.length > 0) {
                        var result = creep.repair(targets[0]) 
                        if(result == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0]);
                        }
                        else if(result !== OK){
                            console.log(creep.name, "Can't repair: " + ERROR_MESSAGES[result]);
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