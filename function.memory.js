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
            Memory.rooms[roomName].containers ??= [];
            Memory.rooms[roomName].links ??= [];
            Memory.rooms[roomName].storage ??= [];
            Memory.rooms[roomName].towers ??= [];
            Memory.rooms[roomName].sources ??= [];

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
                for(workRoom in POPS[roomName]){
                    console.log(roomName + " has room " + workRoom + " as a work room")
                }
                //this.buildRoads(roomName);
            }
        }
    },
    buildRoads: function(roomName){
        //Hard coded for testing
        if(roomName === 'W39S3'){
            console.log('Testing road pathing..')

            let spawnPos = Game.spawns[Memory.rooms[roomName].spawns[0]].pos;
            let sourcePos = Game.getObjectById('5bbcaae69099fc012e63265a').pos;
            let roadPath = PathFinder.search( spawnPos, {pos: sourcePos, range: 1});

            console.log('roadPath is ' + roadPath.path.length  + ' tiles long -- ideally it would take a creep with ' + roadPath.path.length * 2 / 5 + ' carry parts to be effecient.')
            for(pathStep of roadPath.path){
                const roads = pathStep.lookFor(LOOK_STRUCTURES)
                const hasRoad = roads.some(struct => struct.structureType === STRUCTURE_ROAD)
                if(!hasRoad){
                    //Game.rooms[pathStep.roomName].createConstructionSite(pathStep.x, pathStep.y, STRUCTURE_ROAD)
                }
            }
        }

    },
    checkContainers: function(roomName){

        //TODO: Finish this, needs to work rooms that belong to roomName... maybe?
        /*
        const room = Game.rooms[roomName];
        const containers = room.find(FIND_MY_STRUCTURES, {filter: structure => (STRUCTURE_CONTAINER)});
        for(const container of containers){
            if(!Memory.rooms[roomName].containers.includes(container.id)){
                Memory.rooms[roomName].containers.push(container.id);
            }
        }

        for(const container of containers){
            container = 
        }

        const links = room.find(FIND_MY_STRUCTURES, {filter: structure => (STRUCTURE_LINK)});
        for(const link of links){
            if(!Memory.rooms[roomName].links.includes(link.id)){
                Memory.rooms[roomName].links.push(link.id);
            }
        }

        const storages = room.find(FIND_MY_STRUCTURES, {filter: structure => (STRUCTURE_STORAGE)});
        for(const storage of storages){
            if(!Memory.rooms[roomName].storage.includes(storage.id)){
                Memory.rooms[roomName].storage.push(storage.id);
            }
        }

        creep.room.find(FIND_STRUCTURES, {
                        filter: structure =>
                            ((structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) || 
                            ((structure.structureType == STRUCTURE_CONTAINER) && (_.sum(structure.store) < structure.storeCapacity)) ||
                            ((structure.structureType == STRUCTURE_STORAGE) && (_.sum(structure.store) < structure.storeCapacity))
                    });*/
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