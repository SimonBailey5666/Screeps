var common = require('function.common');

var roleDefender = {
    
    run: function(creep){
        const hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        
        if(creep.attack(hostile) === ERR_NOT_IN_RANGE){
            creep.moveTo(hostile);
        }
        if(!hostile){
            if(!creep.memory.inSquad){
                if(this.findSquad(creep.memory.home, creep.memory.work)){
                    creep.memory.inSquad = true;
                    if(creep.memory.working && creep.carry.energy == 0) {
                        creep.memory.working = false;
                        creep.say('Moving out!');
                    }
                }
            }
            if((!common.inWorkRoom(creep) || common.atExit(creep.pos)) && creep.memory.inSquad){
                creep.moveTo(new RoomPosition(25, 25, creep.memory.work));
            }
        }
    },
    findSquad: function(home, work){
        const defenders = _.filter(
                    Game.creeps,
                    creep =>
                        creep.memory.role === 'defender' &&
                        creep.memory.home === home &&
                        creep.memory.work === work
                ).length;

        if(defenders >= 4){
            return true;
        }
        return false;
    }
    
}

module.exports = roleDefender;