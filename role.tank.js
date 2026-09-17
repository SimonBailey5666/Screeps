require('config');
var common = require('function.common');

var roleTank = {

    run: function(creep) {
        
        this.initMemory(creep);
        if(!creep.memory.squadReady){
            
            //Offset the search so not everyone is looking at the same time
            digit = creep.name.slice(-1);
            var offset = Number(digit);
            if(common.atTick(5, offset)){
                this.findSquad(creep)
                if(creep.memory.subordinates.length >= SQUAD_SIZE-1){
                    creep.memory.squadReady = true;
                }
            }
            else {
                common.gotoRally(creep, creep.memory.home);
            }
            
            return;
        }
        if(creep.memory.squadReady){

            //If not at max health go to rallypoint
            if(creep.memory.rallypoint && Game.flags[creep.memory.rallypoint] && !creep.memory.procced){
                if(creep.hits === creep.hitsMax){
                    creep.memory.procced = true;
                }

                creep.moveTo(Game.flags[creep.memory.rallypoint])
                return;
            }
            if((!common.inWorkRoom(creep) || common.atExit(creep.pos))){
                if(creep.memory.waypoint){
                    //TODO: max moveto relative to exit
                    var moveres = creep.moveTo(new RoomPosition(16, 2, creep.memory.work));
                    if(moveres != OK){
                        //console.log(creep + ": can't move to room " + global.ERROR_MESSAGES[moveres]);
                    }
                    return;
                }
                if(creep.moveTo(Game.flags[creep.memory.rallypoint]) === OK){
                    creep.memory.waypoint = true;
                }
            }
            if(creep.hits < creep.hitsMax*0.60){
                creep.memory.waypoint = false;
                creep.memory.procced = false;
                return;
            }
            const enemies = creep.pos.findInRange(
                FIND_HOSTILE_CREEPS,
                1
            );
            
            if (enemies.length > 0) {
                creep.attack(enemies[0]);
            }
        }
       
    },
    initMemory(creep){
        creep.memory.squadLeader = true;
        creep.memory.subordinates ??= [];
        
        if(!creep.memory.rallypoint){
            
            const tankFlags = Object.values(Game.flags)
                .filter(flag => flag.name.startsWith('tank'));
            const tanks = _.filter(Game.creeps, creep => creep.memory.role === 'tank');
            
            for(const flag of tankFlags){
                
                const exits = Game.map.describeExits(flag.pos.roomName);
                const hasExit = Object.values(exits).includes(creep.memory.work);
                
                if(!hasExit){
                    continue;
                }
                
                var used = false;
                for(const tank of tanks){
                    if(tank.memory.rallypoint === flag.name){
                        var used = true;
                        break;
                    }
                }
                if(!used){
                    creep.memory.rallypoint = flag.name;
                }
            }
        }
    },
    findSquad: function(sCreep) {
        const subordinates = _.filter(Game.creeps, creep => creep.memory.subordinate && creep.memory.work === sCreep.memory.work && creep.pos.roomName === sCreep.pos.roomName && creep.memory.leader === sCreep.name)
        for(const subordinate of subordinates){
            if(!sCreep.memory.subordinates.includes(subordinate.name) && sCreep.memory.subordinates.length < SQUAD_SIZE-1){
                sCreep.memory.subordinates.push(subordinate.name);
            }
        }
        
        if(sCreep.memory.subordinates){
            for(const subordinate of sCreep.memory.subordinates){
                if(Game.creeps[subordinate].memory.leader != sCreep.name){
                    delete sCreep.memory.subordinates[subordinate];
                }
            }
        }
        
    },
    waitSquad: function(sCreep){
        //Don't wait on an exit
        if(!common.atExit(sCreep.pos)){
            for(const sName of sCreep.memory.subordinates){
                subordinate = Game.creeps[sName];
                if(sCreep.pos.inRangeTo(subordinate.pos, 1)){
                    continue;
                }
                return true;
            }
        }
        return false;
        
    }
};

module.exports = roleTank;
