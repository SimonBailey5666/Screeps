require('config');
var common = require('function.common');

var roleHealer = {

    run: function(creep) {
        
        this.initMemory(creep);
        if(!creep.memory.squadReady){
            
            //Offset the search so not everyone is looking at the same time
            
            this.findSquadLeader(creep)
            common.gotoRally(creep, creep.memory.home);
            
            
            return;
        }
        
        const leader = Game.creeps[creep.memory.leader];
        if(leader && creep.memory.squadReady){
           if(Game.flags[leader.memory.rallypoint]){
               
                if(leader.hits < leader.hitsMax){
                    
                     if (leader.pos.roomName === creep.pos.roomName){
                        const result = creep.heal(leader);
                        return;
                     }
                     
                }  

                if(!creep.memory.waypoint){
                    common.gotoRally(creep, leader.memory.rallypoint);
                    return;
                } 
            }
        }
        else {
            if(creep.ticksToLive < 600)
            {
                creep.suicide();
            }
            else {
                creep.memory.squadReady = false;
                delete creep.memory.leader;
            }
        }
    },
    initMemory: function(creep){
        creep.memory.subordinate = true;
    },
    findSquadLeader: function(sCreep) {
        if(!sCreep.memory.leader){
            const leaders = _.filter(Game.creeps, creep => creep.memory.squadLeader && creep.memory.work === sCreep.memory.work && creep.pos.roomName === sCreep.pos.roomName && !creep.memory.squadReady)
            for(const leader of leaders){
                if(leader.memory.subordinates.length < SQUAD_SIZE - 1){
                    sCreep.memory.leader = leader.name;
                    sCreep.memory.squadWait = Game.time;
                    break;
                } 
            }
        }
        else {
            const leader = Game.creeps[sCreep.memory.leader];
            if(leader.memory.squadReady && leader.memory.subordinates.includes(sCreep.name)){
                sCreep.memory.squadReady = true
            }
            else if(Game.time - sCreep.memory.squadWait > 100){
                delete sCreep.memory.leader;
                delete sCreep.memory.squadWait;
            }
        }
    }
};

module.exports = roleHealer;
