var tower = {
        run: function(towers){
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
        }
}

module.exports = tower;