var collect = require('function.collect');
var common = require('function.common');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }
        
        if(!creep.memory.working) {
                
            if(common.hasEnergyStorage(creep.room)){
                collect.fromStorage(creep);
            } 
            else{
                collect.run(creep);
            }
        }
        else {
            
            //console.log(struct);
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
            else{
                var struct = creep.room.lookForAt(LOOK_STRUCTURES, creep.pos.x+1, creep.pos.y);
                struct = struct.toString();
                if(struct.indexOf('controller') != -1){
                    creep.move(LEFT);
                }
                struct =  creep.room.lookForAt(LOOK_STRUCTURES, creep.pos.x-1, creep.pos.y);
                struct = struct.toString();
                if(struct.indexOf('controller') != -1){
                    creep.move(RIGHT);
                }
                
            }
        }
    }
};

module.exports = roleUpgrader;