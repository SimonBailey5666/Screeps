require('config');

var memoryManager = {

    initializeRoomMemory: function() {
        Memory.rooms ??= {};
    
        // Remove rooms that are no longer configured
        for (const roomName in Memory.rooms) {
            if (!(roomName in POPS)) {
                console.log('Clearing non-existing room:', roomName);
                delete Memory.rooms[roomName];
            }
        }
    
        // Initialize configured rooms
        for (const roomName in POPS) {
            Memory.rooms[roomName] ??= {};
            Memory.rooms[roomName].spawnQueue ??= [];
        }
    },
    removeDeadCreeps: function(){
        for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    }
};

module.exports = memoryManager;