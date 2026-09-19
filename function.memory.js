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
            Memory.rooms[roomName].spawns ??= [];
            Memory.rooms[roomName].towers ??= [];

            if(!Memory.rooms[roomName].energyMonitor && Memory.rooms[roomName].rcl >= 4){
                const storage = Game.rooms[roomName].storage;
                if(storage){
                    Memory.rooms[roomName].energyMonitor = {energy: storage.store[RESOURCE_ENERGY], at: Game.time, threshold: 0};
                }
            }

            if(!Memory.rooms[roomName].sortQueue) {
                Memory.rooms[roomName].sortQueue = Game.time;
            }
            if(!Memory.rooms[roomName].rcl){
                Memory.rooms[roomName].rcl = Game.rooms[roomName].controller.level;
            }
            
            if(common.atTick(100)){
                //console.log("Checking structures in memory");
                this.checkSpawns(roomName);
                this.checkTowers(roomName);
                if(Memory.rooms[roomName].rcl < Game.rooms[roomName].controller.level){
                    Game.notify("Room " + roomName + " has increased it's control level!")
                    Memory.rooms[roomName].rcl = Game.rooms[roomName].controller.level;
                }
                else if(Memory.rooms[roomName].rcl > Game.rooms[roomName].controller.level){
                    Game.notify("Room " + roomName + " has decreased it's control level!")
                    Memory.rooms[roomName].rcl = Game.rooms[roomName].controller.level;
                }
                //this.buildRoads(roomName);
            }
        }
    },
    buildRoads: function(roomName){

    },
    checkContainers: function(roomName){

    },
    checkSpawns: function(roomName){
        const spawns = Game.rooms[roomName].find(FIND_MY_SPAWNS);
        
        for(const spawn of spawns){
            if(!Memory.rooms[roomName].spawns.includes(spawn.name)){
                Memory.rooms[roomName].spawns.push(spawn.name);
            }
        }
        
        //Delete unused spawns
        const storedSpawns = Memory.rooms[roomName].spawns;
        for(spawn of storedSpawns){
            if(!Game.spawns[spawn]){
                const index = Memory.rooms[roomName].spawns.indexOf(spawn)
                Memory.rooms[roomName].spawns.splice(index, 1)
            }
        }
            
    },
    checkTowers: function(roomName){
        const towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_TOWER
        });
        
        for(const tower of towers){
            if(!Memory.rooms[roomName].towers.includes(tower.id)){
                Memory.rooms[roomName].towers.push(tower.id);
            }
        }
        
        //Delete unused towers
        const storedTowers = Memory.rooms[roomName].towers;
        for(towerId of storedTowers){
            tower = Game.getObjectById(towerId);
            if(!tower){
                const index = Memory.rooms[roomName].towers.indexOf(towerId);
                Memory.rooms[roomName].towers.splice(index, 1);
            }
        }
    },
    energyAlert: function(roomName){
        if(common.atTick(1000)){
            const storage = Game.rooms[roomName].storage;
            if(storage){
                if(Memory.rooms[roomName].energyMonitor.energy - storage.store[RESOURCE_ENERGY] > 5000){
                    Memory.rooms[roomName].energyMonitor.threshold++;
                } else {
                    Memory.rooms[roomName].energyMonitor.threshold = 0;
                }

                if(Memory.rooms[roomName].energyMonitor.threshold >= 3){
                    Game.notify("Room " + roomName + " has been in a sigificant energy deficit for approximately three hours!")
                }

                Memory.rooms[roomName].energyMonitor.energy = storage.store[RESOURCE_ENERGY];
                Memory.rooms[roomName].energyMonitor.at = Game.time;
            }
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