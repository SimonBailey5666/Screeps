var roleScout = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (!creep.memory.target) {
            creep.memory.target = creep.memory.work; // Set your target room here
        }
        
        // Navigate to target room
        if (creep.room.name !== creep.memory.target) {
            var exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        } else {
            // Inside target room: gather and store data
            // Move to controller or wander around
            creep.moveTo(creep.room.controller);
        }
    }
}

module.exports = roleScout;