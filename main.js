require('config');
const ScreepRole = require("wrapper.screeprole");
const SpawnManager = require("wrapper.spawnmanager");

module.exports.loop = function () {

    //Set spawn memory
    if (!Memory.spawns) {
        Memory.spawns = {};
    }
    if (!Memory.spawns['Spawn1']) {
        Memory.spawns['Spawn1'] = {};
    }

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    
    const manager = new SpawnManager(Game.spawns['Spawn1']);
    manager.run();
    
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