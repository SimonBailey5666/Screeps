var collect = {
    run: function(creep){
        creep.memory.target = false;
        var sources = creep.room.find(FIND_SOURCES);
        sources.push(creep.room.storage);
        
        // if the closest source has energy go to it, otherwise go to the other one. sources[0],[1]
        while(!creep.memory.target && sources.length)
        {
            var closest = creep.pos.findClosestByRange(sources);
            if(closest.energy > 0){
                creep.memory.target = closest;
            }
            else{
                sources.splice(sources.indexOf(closest),1);
            }
        }
        
        //target = sources[0];
        if(creep.harvest(creep.memory.target) == ERR_NOT_IN_RANGE) {
                //if(creep.room.lookForAt(LOOK_STRUCTURES, creep.pos.x, creep.pos.y))
                //    creep.room.createConstructionSite(creep.pos.x,creep.pos.y, STRUCTURE_ROAD);
                creep.moveTo(creep.memory.target, {visualizePathStyle: {stroke: '#ffaa00'}, reusePath: PATH_TICK_RECALC});
        }
    },
    fromStorage: function(creep) {

        const storage = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_CONTAINER &&
                       structure.store.energy > 0;
            }
        });

        if (!storage){
            console.log(creep.name+": no storage found!");
            return;
        }
        var target = creep.pos.findClosestByRange(storage);
        const result = creep.withdraw(target, RESOURCE_ENERGY);
        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {
                visualizePathStyle: { stroke: '#ffaa00' }
            });
        }
    },
    shareenergy: function(creep){
        var find = creep.room.find(FIND_CREEPS);
        var target;
         for(name in Memory.creeps){
             if(Game.creeps[name].carry.energy < Game.creeps[name].carryCapacity && Game.creeps[name].memory.role != 'havester' && name != creep.name)
             {
                target = Game.creeps[name];
             }
            
        }
        creep.say('share with ' + target.toString());
         if(creep.transfer(target) == ERR_NOT_IN_RANGE) {
                creep.move(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }, 
    pickupEnergy: function(creep){
        
        const drops = creep.room.find(FIND_DROPPED_RESOURCES, {
            filter: resource => resource.resourceType === RESOURCE_ENERGY
        });
    
        const target = drops.length
            ? drops.reduce((largest, drop) =>
                drop.amount > largest.amount ? drop : largest
              )
            : null;
    
        if (!target) {
            return false;
        }
    
        const result = creep.pickup(target);
    
        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {
                visualizePathStyle: { stroke: '#ffaa00' }
            });
        }

    },
    mine: function(creep) {

        var source = creep.pos.findClosestByRange(FIND_SOURCES);

        if (!source) {
            return;
        }
    
        var result = creep.harvest(source);
    
        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {
                visualizePathStyle: {
                    stroke: '#ffaa00'
                },
                reusePath: PATH_TICK_RECALC
            });
        }
    }
};

module.exports = collect;