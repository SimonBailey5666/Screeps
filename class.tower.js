class TowerManager {

    constructor(roomName) {
        
        this.towers = [];
        this.roomName = roomName;
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
            //test
            //Repair fortifications if it doesn't hold up spawn
            const room = Game.rooms[this.roomName];
            if(room.energyCapacityAvailable - room.energyAvailable < 300){
                const fortification = tower.room.find(FIND_STRUCTURES, {
                    filter: structure =>
                        structure.hits / structure.hitsMax < 0.1 &&
                        (
                            structure.structureType === STRUCTURE_WALL ||
                            structure.structureType === STRUCTURE_RAMPART
                        )
                }).sort((a, b) => a.hits - b.hits)[0];
            
                tower.repair(closestDamagedFort);
            }         
        }
    }
}

module.exports = TowerManager;