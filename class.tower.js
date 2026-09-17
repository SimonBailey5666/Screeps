class TowerManager {

    constructor(roomName) {
        const towerIds = Memory.rooms[roomName].towers;
        const towers = [];

        for(const towerId of towerIds){
            const tower = Game.getObjectById(towerId);
            if(tower){
                towers.push(tower);
            } 
            else {
                delete Memory.rooms[roomName].towers[tower];
            }
        }
    }

    run(towers){
        for (const tower of towers) {
            
            const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        
            if (closestHostile) {
                tower.attack(closestHostile);
                return;
            }
            
            
            const damagedCreeps = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: creep => creep.hits < creep.hitsMax
            });
            if (damagedCreeps) {
                tower.heal(damagedCreeps);
            }
            
            const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: structure => (structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL)
            });
        
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
                return;
            }
        
            
        }
    }
}

module.exports = towerManager;