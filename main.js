require('config');
const ScreepRole = require("wrapper.screeprole");
const SpawnManager = require("wrapper.spawnmanager");
const spawnCreeps = require("function.spawncreep");

const common = require('function.common');

module.exports.loop = function () {

    //Set spawn memory
    if (!Memory.spawns) {
        Memory.spawns = {};
    }
    if (!Memory.spawns['Spawn1']) {
        Memory.spawns['Spawn1'] = {};
    }
    
    //Set queue memory TODO: this needs to work of roompop
    if(!Memory.rooms){
        Memory.rooms = {};
    }
    if(!Memory.rooms['W38S4']){
         Memory.rooms['W38S4'] = {};
    }
    if(!Memory.rooms['W38S4'].spawnQueue){
        Memory.rooms['W38S4'].spawnQueue = [];
    }
    

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    const towers = Game.rooms['W38S4'].find(FIND_MY_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_TOWER
    });
    
    for (const tower of towers) {
        const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: structure => (structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL)
        });
    
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
    
        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }
    
    if(common.atTick(10)){
        for(var roomName in Memory.rooms){
            const manager = new SpawnManager(roomName);
             manager.run();
        }        
    }
    for(var roomName in Memory.rooms){
        spawnCreeps.workercreep(roomName);
    }
    
    if(Game.spawns['Spawn1'].room.find(FIND_HOSTILE_CREEPS).length >= 2){
        if(!Memory.spawns['Spawn1'].hostilesDetected){
            Memory.spawns['Spawn1'].hostilesDetected = Game.time;
        } 
        else if(Game.time -  Memory.spawns['Spawn1'].hostilesDetected >= 50){
            Game.spawns['Spawn1'].room.controller.activateSafeMode();
        } 
    } 
    else if(Memory.spawns['Spawn1'].hostilesDetected){
        delete Memory.spawns['Spawn1'].hostilesDetected;
    }
    
    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        const screep = new ScreepRole(Game.creeps[name]);
        screep.run();
    }
}