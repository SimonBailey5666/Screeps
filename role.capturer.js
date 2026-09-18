
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
                    if(target.owner){
                        creep.attackController(target)
                        return;
                    } 
                    else if(Game.flag['claim']?.pos.roomName === creep.memory.work){
                        creep.claimController(target)
                        return;
                    }
                    creep.reserveController(target);
                }
                else{
                    creep.moveTo(target);
                }
            }
        }
    }
};

module.exports = roleDefender;


