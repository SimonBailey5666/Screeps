//Assortment of functions that are useful for a variety of creeps

var common = {
    countCreeps: function() {
        const populations = {};
        for (const name in Game.creeps) {
    
            const creep = Game.creeps[name];
    
            const role = creep.memory.role;
            const workRoom = creep.memory.work;
    
            if (!role || !workRoom) {
                continue;
            }
    
            if (!populations[role]) {
                populations[role] = {};
            }
    
            if (!populations[role][workRoom]) {
                populations[role][workRoom] = 0;
            }
    
            populations[role][workRoom]++;
        }
    
        for (const role in populations) {
    
            const rooms = Object.entries(populations[role])
                .map(([room, count]) => `${room} ${count}`)
                .join(' ');
    
            console.log(`${role}s {${rooms}}`);
        }
    },
    attackClosest: function(creep, targets, filter){
        var closestTarget = creep.pos.findClosestByPath(targets, filter);
        if(closestTarget){
            if(creep.room.controller?.safeMode){
                if(Game.time % 10 === 0){
                    console.log(creep.name + " can't attack in safe room: " + creep.room.name);
                }
                return true;
            }
            var attackRes;
            if(creep.getActiveBodyparts(RANGED_ATTACK)){
                attackRes = creep.rangedAttack(closestTarget);
            }
            else {
                arrackRes = creep.attack(closestTarget);
            }
    
            if(attackRes == ERR_NOT_IN_RANGE){
                creep.moveTo(closestTarget);
            }
            else if(attackRes !== OK){
                console.log(creep.name + " can't attack " + closestTarget + ": " + ERROR_MESSAGES[attackRes]);
            } 
            
            return true;
        }
        else {
            return false;
        }
    },
    hasEnergyStorage(room) {
      return room.find(FIND_STRUCTURES, {
                    filter: s =>
                        ((s.structureType === STRUCTURE_STORAGE &&
                        s.store[RESOURCE_ENERGY] > 0 ) || (s.structureType === STRUCTURE_CONTAINER &&
                        s.store[RESOURCE_ENERGY] > 0 ))
            }).length > 0;  
    },
    atExit: function(pos) {
        return pos.x === 0 || pos.x === 49 || pos.y === 0 || pos.y === 49;
    },
    inWorkRoom: function(creep){
        return creep.memory.work === creep.room.name;
    },
    inHomeRoom: function(creep){
        return creep.memory.home === creep.room.name;
    },
    atTick: function(tick){
        return Game.time % tick === 0;
    },
    flushSpawnQueue: function(homeRoom = 'W38S4'){
        delete Memory.rooms[homeRoom].spawnQueue;
    }
};

module.exports = common;