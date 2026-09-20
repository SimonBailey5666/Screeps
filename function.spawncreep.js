let spawncreep = {
    
    workercreep: function(roomName){
        
        if(!Memory.rooms[roomName].spawnQueue[0]){
            return OK;
        }
        const sRole = Memory.rooms[roomName].spawnQueue[0].role;
        const workRoom = Memory.rooms[roomName].spawnQueue[0].locations.work;
        let energy = Game.rooms[roomName].energyAvailable;

        let workRoomPop = global.POPS[roomName][workRoom];
        let popSettings = workRoomPop[sRole];
        if(global.DEBUG_OUT){
            console.log('Attempting to spawn ' + sRole + ' with ' + energy + ' energy');
        }
        //console.log("debug " + roomName + " " + sRole + " " + workRoomPop + " " + popSettings);
        if(popSettings.minCost > energy){
            if(global.DEBUG_OUT){
                console.log('Cannot build ' + sRole + ' not enough resources.');
            }
             return ERR_NOT_ENOUGH_ENERGY;
        }

        //Only use all available energy if a maximum isnt specified in the pop settings
        if(popSettings.maximumCost && energy>popSettings.maximumCost){
            energy = popSettings.maximumCost;
        }

        let body = this.buildBody(global.TEMPLATES[sRole].parts, energy)
        if(!body.includes(MOVE)){
            console.log('Cannot build ' + sRole + ' invalid body(no move). ' + body.toString());
            return ERR_INVALID_ARGS;
            
        } 
        else if(!body.includes(CARRY) && (sRole !== 'defender' && sRole !== 'miner' && sRole !== 'scout' && sRole !== 'healer' && sRole !== 'tank' && sRole !== 'capturer')){
            console.log('Cannot build ' + sRole + ' invalid body(no carry). ' +  body.toString());
            return ERR_INVALID_ARGS;
        }
        
        body.sort();
        body.reverse();
       
        let newName = sRole.charAt(0).toUpperCase() + sRole.slice(1) + '-' + roomName + '-' + Math.floor(100000 + Math.random() * 900000);
        
        for(spawnName of Memory.rooms[roomName].spawns){
            spawn = Game.spawns[spawnName];
            if(spawn.spawning)  {
                return OK;
            }
            
            let result = spawn.spawnCreep(body, newName,{memory:{role: sRole, home: roomName, work: workRoom}})
            if(result !== 0){
                console.log('Cannot build ' + sRole + '. Reason: ' + ERROR_MESSAGES[result]);
                return ERROR_MESSAGES[result];
            }
            console.log('Successfully spawned: ' + newName);
            Memory.rooms[roomName].spawnQueue.shift();
            return result;
        }
        
    },
    buildBody: function(template, energy) {
        const parts = [
            WORK, MOVE, CARRY, ATTACK,
            RANGED_ATTACK, HEAL, CLAIM, TOUGH
        ];

        let totalWeight = 0;
    
        for (let i = 0; i < template.length; i++) {
            if (template[i] > 0) {
                totalWeight += template[i];
            }
        }
    
        let bestBody = [];
    
        for (let size = 1; size <= 50; size++) {
    
            let candidate = [];
            let cost = 0;
    
            for (let i = 0; i < template.length; i++) {
    
                if (template[i] > 0) {
    
                    let amount = Math.round(
                        size * template[i] / totalWeight
                    );
    
                    for (let j = 0; j < amount; j++) {
                        candidate.push(parts[i]);
                        cost += BODYPART_COST[parts[i]];
                    }
                }
            }
    
            // Don't allow more than 50 parts
            if (candidate.length > 50) {
                continue;
            }
    
            // Candidate must be affordable
            if (cost <= energy) {
                bestBody = candidate;
            }
        }
    
        return bestBody;
    }
};
module.exports = spawncreep;