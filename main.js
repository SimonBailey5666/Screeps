require('config');
const ScreepRole = require("wrapper.screeprole");
const SpawnManager = require("wrapper.spawnmanager");
const memoryManager = require('function.memory');

const TowerManager = require('class.tower');
const common = require('function.common');

global.util = require('function.util');
global.util = require('function.common');

module.exports.loop = function () {


    memoryManager.initializeRoomMemory();
    memoryManager.removeDeadCreeps();
    
    
    //Manage each room with a spawn defined in roompop
    let tickOffset = 0;
    for(var roomName in Memory.rooms){
        
        const spawnManager = new SpawnManager(roomName);
        spawnManager.run(tickOffset);

        const towerManager = new TowerManager(roomName);
        towerManager.run();
        

        if(common.atTick(5) || Memory.rooms[roomName].hostilesDetected){
            if(Game.rooms[roomName].find(FIND_HOSTILE_CREEPS).length >= 2){
                if(!Memory.rooms[roomName].hostilesDetected){
                    Memory.rooms[roomName].hostilesDetected = Game.time;
                }
                else if (Game.time - Memory.rooms[roomName].hostilesDetected >= 40){
                    if(!Game.rooms[roomName].controller?.safeMode){
                        Game.notify(roomName + " has entered safe mode!")
                        Game.rooms[roomName].controller.activateSafeMode();
                    }
                }
            }
            else if (Memory.rooms[roomName].hostilesDetected){
                delete Memory.rooms[roomName].hostilesDetected;
            }
        }
        
        
        for(spawnName of Memory.rooms[roomName].spawns){
            
            const spawn = Game.spawns[spawnName];
            if(spawn.spawning){
                let spawningCreep = spawn.spawning.name;
                spawn.room.visual.text(
                    '🛠️' + spawningCreep,
                    spawn.pos.x + 1,
                    spawn.pos.y,
                    {align: 'left', opacity: 0.8});
            }
        }
        tickOffset += 5;
    }

    for(const name in Game.creeps) {
        const screep = new ScreepRole(Game.creeps[name]);
        screep.run();
    }
}