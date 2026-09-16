require('config');
//Assortment of functions that are useful for a variety of creeps

var util = {
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
    flushSpawnQueue: function(homeRoom = DEFAULT_HOME){
        delete Memory.rooms[homeRoom].spawnQueue;
        console.log("Queue for room " + homeRoom + " cleared.")
    },
    outputSpawnQueue: function(homeRoom = DEFAULT_HOME){
        var output = [];
        const spawnQueue = Memory.rooms[homeRoom].spawnQueue;
        for(const spawn of spawnQueue){
            output.push(String(spawn.role) + "-" + String(spawn.locations.work));
        }
        if(output.length < 1){
            return "Spawn Queue empty";   
        }
        return output;
    }
};

module.exports = util;