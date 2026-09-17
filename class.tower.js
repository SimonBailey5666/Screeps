class TowerManager {

    constructor(roomName) {
        
        this.towers = [];
        const towerIds = Memory.rooms[roomName].towers;


        for(const towerId of towerIds){
            const tower = Game.getObjectById(towerId);
            if(tower){
                this.towers.push(tower);
            } 
            else {
                const index = Memory.rooms[roomName].towers.indexOf(towerId);
                Memory.rooms[roomName].towers.splice(index,1);
            }
        }
    }

    run(){
        for (const tower of this.towers) {
            const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        
            if (closestHostile) {
                tower.attack(closestHostile);
                continue;
            }
            
            
            const damagedCreeps = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: creep => creep.hits < creep.hitsMax
            });
            if (damagedCreeps) {
                tower.heal(damagedCreeps);
                continue;
            }
            
            const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: structure => (structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL && structure.structureType !== STRUCTURE_RAMPART)
            });
        
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
                continue;
            }

            const closestDamagedFort = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: structure => (structure.hits < 100000 && (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART))
            });

            tower.repair(closestDamagedFort);
            continue;
        
            
        }
    }
}

module.exports = TowerManager;