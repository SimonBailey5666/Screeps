require('config');
const ScreepRole = require("wrapper.screeprole");
const SpawnManager = require("wrapper.spawnmanager");
const memoryManager = require('function.memory');
const spawnCreeps = require("function.spawncreep");

const tower = require('function.tower');
const common = require('function.common');

global.util = require('function.util');

module.exports.loop = function () {

    memoryManager.initializeRoomMemory();
    memoryManager.removeDeadCreeps();
    
    var tickOffset = 0;
    for(var roomName in Memory.rooms){
        
        if(common.atTick(15, tickOffset)){
            const manager = new SpawnManager(roomName);
            manager.run();
        } 
        var result = spawnCreeps.workercreep(roomName);
        if(result !== OK && result !== ERR_NOT_ENOUGH_EXTENSIONS){
            console.log("Spawn failed", ERROR_MESSAGES[result]);
        }

        const towerIds = Memory.rooms[roomName].towers;
        const towers = [];
        for(const towerId of towerIds){
            const tower = Game.getObjectById(towerId);
            if(tower){
                towers.push(tower);
            }
        }
        tower.run(towers);
        
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
            
            spawn = Game.spawns[spawnName];
            if(spawn.spawning){
                var spawningCreep = spawn.spawning.name;
                spawn.room.visual.text(
                    '🛠️' + spawningCreep,
                    spawn.pos.x + 1,
                    spawn.pos.y,
                    {align: 'left', opacity: 0.8});
            }
        }
        tickOffset += 5;
    }

    for(var name in Game.creeps) {
        const screep = new ScreepRole(Game.creeps[name]);
        screep.run();
    }
}