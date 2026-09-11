var collect = require('function.collect');

//Only mine and drop stuff on the ground when the room is established

var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // Make sure the creep has a work room
        
        var atExit = this.isAtExit(creep.pos)
        
        // Travel to work room
        if (creep.room.name !== creep.memory.work || atExit) {

            creep.moveTo(
                Game.rooms[creep.memory.work].controller,
                {
                    visualizePathStyle: {
                        stroke: '#ffaa00'
                    },
                    reusePath: PATH_TICK_RECALC
                }
            );

            return;
        }

        // We are in the work room
        collect.mine(creep);
    },
    isAtExit: function(pos) {
        return pos.x === 0 || pos.x === 49 || pos.y === 0 || pos.y === 49 || pos.x === 1 || pos.x === 48 || pos.y === 1 || pos.y === 48;
    }
};



module.exports = roleMiner;
