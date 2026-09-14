require('config');
const ScreepRole = require("wrapper.screeprole");
const SpawnManager = require("wrapper.spawnmanager");
const memoryManager = require('function.memory');
const spawnCreeps = require("function.spawncreep");

const tower = require('function.tower');
const common = require('function.common');

module.exports.loop = function () {

    memoryManager.initializeRoomMemory();
    memoryManager.removeDeadCreeps();

    for(var roomName in Memory.rooms){
        
        if(common.atTick(30)){
            const manager = new SpawnManager(roomName);
            manager.run();    
        }
        spawnCreeps.workercreep(roomName);


        const towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_TOWER
        });
        tower.run(towers);
        
        
        if(Game.rooms[roomName].find(FIND_HOSTILE_CREEPS).length >= 2){
            if(!Memory.rooms[roomName].hostilesDetected){
                Memory.rooms[roomName].hostilesDetected = Game.time;
            }
            else if (Game.time - Memory.rooms[roomName].hostilesDetected >=50){
                Game.rooms[roomName].controller.activateSafeMode();
            }
        }
        else if (Memory.rooms[roomName].hostilesDetected){
            delete Memory.rooms[roomName].hostilesDetected;
        }
        
        
        for(spawn of Game.rooms[roomName].find(FIND_MY_SPAWNS)){
            if(spawn.spawning){
                var spawningCreep = spawn.spawning.name;
                spawn.room.visual.text(
                    '🛠️' + spawningCreep,
                    spawn.pos.x + 1,
                    spawn.pos.y,
                    {align: 'left', opacity: 0.8});
            }
        }
    }

    for(var name in Game.creeps) {
        const screep = new ScreepRole(Game.creeps[name]);
        screep.run();
    }
}