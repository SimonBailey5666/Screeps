var spawncreep = {
    
    workercreep: function(spawn, srole, energy, location){
        
        const ERR_NAMES = {
            [OK]: 'OK',
            [ERR_NOT_OWNER]: 'ERR_NOT_OWNER',
            [ERR_NAME_EXISTS]: 'ERR_NAME_EXISTS',
            [ERR_BUSY]: 'ERR_BUSY',
            [ERR_NOT_ENOUGH_ENERGY]: 'ERR_NOT_ENOUGH_ENERGY',
            [ERR_INVALID_ARGS]: 'ERR_INVALID_ARGS',
            [ERR_RCL_NOT_ENOUGH]: 'ERR_RCL_NOT_ENOUGH',
        };
        var workroom = global.POPS[location.work];
        var popSettings = workroom[srole];
        if(global.DEBUG_OUT){
            console.log('Attempting to spawn ' + srole + ' with ' + energy + ' energy');
        }
        
        if(popSettings.minCost > energy){
            if(global.DEBUG_OUT){
                console.log('Cannot build ' + srole + ' not enough resources.');
            }
             return;
        }

        //Only use all available energy if a maximum isnt specified in the pop settings
        if(popSettings.maximumCost && energy>popSettings.maximumCost){
            energy = popSettings.maximumCost;
        }

        var body = this.buildBody(global.TEMPLATES[srole].parts, energy)
        if(!body.includes(MOVE)){
            if(global.DEBUG_OUT){
                console.log('Cannot build ' + srole + ' invalid body(no move). ' + body.toString());
            }
            return;
            
        } 
        else if(!body.includes(CARRY) && (srole !== 'defender' && srole !== 'miner')){
            if(global.DEBUG_OUT){
                console.log('Cannot build ' + srole + ' invalid body(no carry). ' +  body.toString());
            }
            return;
        }
        
        body.sort();
        body.reverse();
        
        var spawnRoom = spawn.room.name;
        var newname = srole.charAt(0).toUpperCase() + srole.slice(1) + '-' + spawnRoom + '-' + Math.floor(1000 + Math.random() * 9000);
        var result = spawn.spawnCreep(body, newname,{memory:{role: srole, home: location.home, work: location.work}})
        if(result !== 0){
            console.log('Cannot build ' + srole + '. Reason: ' + result);
            return;
        }
        console.log('Successfully spawned: ' + newname);
        
    },
    buildBody: function(template, energy) {
        const parts = [
            WORK, MOVE, CARRY, ATTACK,
            RANGED_ATTACK, HEAL, CLAIM, TOUGH
        ];

        var totalWeight = 0;
    
        for (let i = 0; i < template.length; i++) {
            if (template[i] > 0) {
                totalWeight += template[i];
            }
        }
    
        var bestBody = [];
    
        for (let size = 1; size <= 50; size++) {
    
            var candidate = [];
            var cost = 0;
    
            for (let i = 0; i < template.length; i++) {
    
                if (template[i] > 0) {
    
                    var amount = Math.round(
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