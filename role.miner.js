var collect = require('function.collect');

//Only mine and drop stuff on the ground when the room is established

var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // Travel to work room
        if (!common.inWorkRoom(creep) || common.atExit(creep.pos)) {
            creep.moveTo(
                new RoomPosition(25, 25, creep.memory.work), {
                visualizePathStyle: {
                    stroke: '#ffaa00'
                },
                reusePath: PATH_TICK_RECALC
        });
            return;
        }
        if(!creep.memory.target){
            sources = creep.room.find(FIND_SOURCES)
            target = common.setTarget(creep, sources);
            if(!target){
                console.log("Creep " + creep.name + " cannot find a source to mine");
                return;
            }

            creep.memory.target = target;
        }
        
        source = Game.getObjectById(creep.memory.target);
        if(!creep.memory.storage){
            let container = source.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: (structure) => (structure.structureType === STRUCTURE_CONTAINER
                || structure.structureType === STRUCTURE_LINK)
            });
            if(container.length > 0){
                creep.memory.storage = container[0].id;
            }
            else {
                 creep.memory.storage = 'none';
            }
        }

        if(creep.memory.storage === 'none' && common.atTick(1000)){
            delete creep.memory.storage;
        }

        if(creep.memory.storage && creep.memory.storage !== 'none'){
            if(creep.carry.energy > 0){
                storage = Game.getObjectById(creep.memory.storage);
                creep.transfer(storage, RESOURCE_ENERGY);
            }
        }
        if(creep.harvest(source) ===  ERR_NOT_IN_RANGE){
            creep.moveTo(source);
        }
    },
};



module.exports = roleMiner;
