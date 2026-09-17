require('config');

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

        if (!sCreep.memory.leader) {

            const leaders = _.filter(
                Game.creeps,
                creep =>
                    creep.memory.squadLeader &&
                    creep.memory.work === sCreep.memory.work &&
                    creep.pos.roomName === sCreep.pos.roomName &&
                    creep.memory.subordinates.length < SQUAD_SIZE - 1
            );

            const rLeaders = _.filter(
                Game.creeps,
                creep =>
                    creep.memory.squadLeader &&
                    creep.memory.work === sCreep.memory.work &&
                    creep.memory.home === sCreep.pos.roomName &&
                    creep.memory.subordinates.length < SQUAD_SIZE - 1
            );

            console.log(leaders);
            let leader = leaders.find(
                leader => !leader.memory.squadReady
            );
            console.log(leader);
            
            if (!leader) {
                leader = rLeaders.find(
                    leader => leader.memory.squadReady
                );
            }
            console.log(leader);

            if (leader) {
                sCreep.memory.leader = leader.name;
                sCreep.memory.squadWait = Game.time;

                // If we joined a squad that is already ready,
                // immediately mark ourselves ready.
                if (leader.memory.squadReady) {
                    if(!leader.memory.subordinates.includes(sCreep.name)){
                        leader.memory.subordinates.push(sCreep.name);
                    }
                    sCreep.memory.squadReady = true;
                }
            }
        }

        else {

            const leader = Game.creeps[sCreep.memory.leader];

            // Leader died / no longer exists
            if (!leader) {
                delete sCreep.memory.leader;
                delete sCreep.memory.squadWait;
                return;
            }

            if (
                leader.memory.squadReady &&
                leader.memory.subordinates.includes(sCreep.name)
            ) {
                sCreep.memory.squadReady = true;
            }

            else if (Game.time - sCreep.memory.squadWait > 100) {
                delete sCreep.memory.leader;
                delete sCreep.memory.squadWait;
            }
        }
    }

};

module.exports = roleHealer;
