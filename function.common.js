require('config');
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
    
            return (`${role}s {${rooms}}`);
        }
    },
    hasRoomVision(room){
        return Game.rooms[room];
    },
    gotoRally: function(creep, flagName){
        var rallyPoint = Game.flags[flagName];
        if(rallyPoint){
            if(!creep.pos.inRangeTo(rallyPoint, 2)) {
                creep.moveTo(rallyPoint);
                return;
            }
            if(!creep.pos.inRangeTo(rallyPoint, 1)){
                creep.moveTo(rallyPoint);
            }
            return OK;
            
        }
        return ERR_NOT_FOUND;
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
    setTarget: function(tCreep, targets, selectSameIfNone = true){
        
        if(targets.length === 0){
            return;
        }
        
        targets.sort((a, b) => {return tCreep.pos.getRangeTo(a) - tCreep.pos.getRangeTo(b);});
    
        const sCreeps = _.filter( Game.creeps, creep => creep.memory.role === tCreep.memory.role && creep.memory.work === tCreep.memory.work);
        
        for (const target of targets) {

            const taken = sCreeps.some(
                creep => creep.memory.target === target.id
            );
            if (!taken) {
                return target.id;
            }
        }
        //If there a no other targets just go to the first one
        if(selectSameIfNone){
            return targets[0].id;
        }
        else{
            return;
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
    atTick: function(tick, offset = 0){
        var time = Game.time;
        return (time - offset) % tick === 0;
    }
};

module.exports = common;