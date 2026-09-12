var collect = require('function.collect');
var common = require('function.common');

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

        // We are in the work room
        collect.mine(creep);
    },
};



module.exports = roleMiner;
