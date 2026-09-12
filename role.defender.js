var common = require('function.common');

var roleDefender = {

    run: function(creep) {
        
        if(!creep.memory.squad){
            if(this.findSquad(creep.pos, creep.memory.work)){
                creep.memory.squad = true;
                creep.say('Moving!');
            }
        }
        if(creep.memory.squad){
            if(!common.inWorkRoom(creep) || common.atExit(creep.pos)){
                var moveres = creep.moveTo(new RoomPosition(28, 32, creep.memory.work));
                if(moveres != OK){
                    console.log(creep + ": can't move to room " + global.ERROR_MESSAGES[moveres]);
                }
                return;
            }
           
            var closestHostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            if(closestHostile){
                 console.log(closestHostile);
            
                var attackRes = creep.rangedAttack(closestHostile);
                if (attackRes === ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestHostile);
                }
                else if (attackRes !== OK) {
                    console.log(creep.name +" can't attack enemy: " + ERROR_MESSAGES[attackRes], creep.getActiveBodyparts(RANGED_ATTACK));
                }
                return;
            }
        }
    },
    findSquad: function(home, work) {
        const defenders = _.filter( Game.creeps, creep => creep.memory.role === 'defender' && creep.memory.work === work).length;
        return defenders >= 4;
    }
};

module.exports = roleDefender;

/*
var roleDefender = {

    run: function(creep) {

        if(!creep.memory.squad){
            if(this.findSquad(creep.pos, creep.memory.work)){
                creep.memory.squad = true;
            }
        }
        if(creep.memory.squad){
            if(!common.inWorkRoom(creep) || common.atExit(creep.pos)){
                creep.moveTo(new RoomPosition(25, 25, creep.memory.work));
            }
            else
            {
                var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if(creep.attack(closestHostile)===ERR_NOT_IN_RANGE ){
                    creep.moveTo(closestHostile);
                }
            }
        }
    },

    findSquad: function(home, work) {
        const defenders = _.filter( Game.creeps, creep => creep.memory.role === 'defender' && creep.room.name === home && creep.memory.work === work).length;
        return defenders >= 4;
    }
};*/
