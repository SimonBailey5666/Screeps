var common = require('function.common');

var roleDefender = {

    run: function(creep) {
        if(!common.inWorkRoom(creep) || common.atExit(creep.pos)){
            creep.moveTo(
                new RoomPosition(25, 25, creep.memory.work)
            );
        }
        else{
            target = creep.room.controller
            if(target){
                if(creep.pos.isNearTo(target)){
                    creep.attackController(target);
                }
                else{
                    creep.moveTo(target);
                }
            }
        }
    }
};

module.exports = roleDefender;


