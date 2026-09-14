var common = require('function.common');

var roleDefender = {

    run: function(creep) {
        
        if(!creep.memory.squad){
            if(this.findSquad(creep.pos, creep.memory.work) || creep.memory.home === creep.memory.work){
                creep.memory.squad = true;
                creep.say('Moving!');
            }
        }
        if(creep.memory.squad){
            if(!common.inWorkRoom(creep) || common.atExit(creep.pos)){
                var moveres = creep.moveTo(new RoomPosition(28, 32, creep.memory.work),{reusePath: PATH_TICK_RECALC});
                if(moveres != OK){
                    console.log(creep + ": can't move to room " + global.ERROR_MESSAGES[moveres]);
                }
                return;
            }
            
            if(!common.attackClosest(creep, FIND_HOSTILE_CREEPS)){
                if(!common.attackClosest(creep, FIND_HOSTILE_STRUCTURES, {filter: structure => structure.structureType !== STRUCTURE_WALL && structure.structureType !== STRUCTURE_CONTAINER && structure.structureType !== STRUCTURE_CONTROLLER})){
                    
                    var rallyPoint = Game.flags[creep.room.name];
                    if(rallyPoint){
                        if(!creep.pos.inRangeTo(rallyPoint, 2)) {
                            creep.moveTo(rallyPoint);
                        }
                    }
                }
            }
        }
    }, 
    findSquad: function(home, work) {
        const defenders = _.filter( Game.creeps, creep => creep.memory.role === 'defender' && creep.memory.work === work && creep.pos.roomName === home).length;
        return defenders >= 4;
    }
};

module.exports = roleDefender;
