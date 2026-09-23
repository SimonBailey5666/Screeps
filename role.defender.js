require('config');

var roleDefender = {

    run: function(creep) {
        
        if(!creep.memory.squad){
            if(common.atTick(5))
            {
                if(this.findSquad(creep.memory.home, creep.memory.work) || creep.memory.home === creep.memory.work){
                    creep.memory.squad = true;
                    creep.say('Moving!');
                }
            }
            else {
                if(!common.inHomeRoom(creep) || common.atExit(creep.pos)){
                    const moveres= creep.moveTo(new RoomPosition(28, 32, creep.memory.home));
                    if(moveres !== OK){
                        console.log(creep + ": can't move to room " + global.ERROR_MESSAGES[moveres]);
                    }
                    return;
                }
                common.gotoRally(creep, creep.pos.roomName);
                return;
            }
        }
        if(creep.memory.squad){
            if(Game.flags['waypoint'] && (creep.memory.home !== creep.memory.work)){

               if(!creep.memory.procced){

                    if(!creep.memory.waypoint){
                        
                        if(common.gotoRally(creep, 'waypoint') == OK){
                            creep.memory.waypoint = true;
                        }
                        return;
                    }
                
                    var atWaypoint = _.filter( Game.creeps, creep => creep.memory.waypoint === true).length;
                    if(atWaypoint >= SQUAD_SIZE){
                        creep.memory.procced = true;
                    }
                    else{
                        return;
                    }
                }
            }
            if(!common.inWorkRoom(creep) || common.atExit(creep.pos)){
                var moveres = creep.moveTo(new RoomPosition(28, 32, creep.memory.work));
                if(moveres != OK){
                    console.log(creep + ": can't move to room " + global.ERROR_MESSAGES[moveres]);
                }
                return;
            }
            
            if(!common.attackClosest(creep, FIND_HOSTILE_CREEPS)){
                if(!common.attackClosest(creep, FIND_HOSTILE_STRUCTURES, {filter: structure => structure.structureType !== STRUCTURE_WALL && structure.structureType !== STRUCTURE_CONTAINER && structure.structureType !== STRUCTURE_CONTROLLER})){
                    common.gotoRally(creep, creep.pos.roomName);
                }
            }
        }
    }, 
    findSquad: function(home, work) {
        const defenders = _.filter( Game.creeps, creep => creep.memory.role === 'defender' && creep.memory.work === work && creep.pos.roomName === home && creep.ticksToLive < 1470).length;
        return defenders >= SQUAD_SIZE;
    }
};

module.exports = roleDefender;
