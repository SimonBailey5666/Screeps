const spawnCreeps = require("function.spawncreep");
const POPS = require("roompop");
const common = require('function.common');

class SpawnManager {

    constructor(roomName) {
        this.roomName = roomName;
        this.room = Game.rooms[roomName];
    }
    run(tickOffset) {

        if(common.atTick(15, tickOffset)){
            this.updateSpawnQueue();
            
            //Queue is getting backlogged, sort it by creep priority so economy doesnt crash
            if(Memory.rooms[this.roomName].spawnQueue.length > 10 && Game.time - Memory.rooms[this.roomName].sortQueue > 100){
                Memory.rooms[this.roomName].sortQueue = Game.time;
                this.sortQueue();
            }
        } 

        let result = spawnCreeps.workercreep(this.roomName);
        if(result !== OK && result !== ERR_NOT_ENOUGH_EXTENSIONS){
            console.log("Spawn failed", ERROR_MESSAGES[result]);
        }
    
    }
    sortQueue(){
        const candidates = [];
        for(const sCreep of Memory.rooms[this.roomName].spawnQueue){
            
            const template = TEMPLATES[sCreep.role];
            
            candidates.push({
                    workRoom: sCreep.locations.work,
                    role: sCreep.role,
                    home: sCreep.locations.home,
                    priority: template.priority
                });
        }
        candidates.sort((a, b) => a.priority - b.priority);
        
        util.flushSpawnQueue();
        for(const candidate of candidates){
            console.log(candidate);
            Memory.rooms[this.roomName].spawnQueue.push({role: candidate.role, locations: {home: candidate.home, work: candidate.work}});
        }
        
    }
    updateSpawnQueue() {
        console.log("Checking room populations for room: " + this.roomName + ".");
        const candidates = [];

        for (const workRoom in POPS[this.roomName]) {
            const populations = POPS[this.roomName][workRoom];

            for (const role in populations) {

                const pop = populations[role];
                const template = TEMPLATES[role];

                if (!template) {
                    console.log(
                        `SpawnManager: No template for ${role}`
                    );
                    continue;
                }

                candidates.push({
                    workRoom: workRoom,
                    role: role,
                    pop: pop,
                    priority: template.priority
                });
            }
        }
        
        candidates.sort((a, b) => a.priority - b.priority);
        for (const candidate of candidates) {

            const { workRoom, role, pop } = candidate;

            // Count role + home + work
            const population = _.filter(
                Game.creeps,
                creep =>
                    creep.memory.role === role &&
                    creep.memory.home === this.roomName &&
                    creep.memory.work === workRoom
            ).length;
            
            //Check queue for any queued creeps
            var qPopulation = _.filter(
               Memory.rooms[this.roomName].spawnQueue,
                creep =>
                    creep.role === role &&
                    creep.locations.home === this.roomName &&
                    creep.locations.work === workRoom
            ).length; 
            
            //Loop to add multiple of same time if required
            while(true){
                if (population + qPopulation >= pop.max) {
                    break;
                }
    
                // Get the work room
                const workRoomObject = Game.rooms[workRoom];
                var sCreep = {role: role, locations: {home: this.roomName, work: workRoom}};
    
                if (pop.spawnIf) {
    
                    // Can't evaluate room-dependent conditions
                    // without vision
                    if (!workRoomObject) {
                        break;
                    }
                    if(global.DEBUG_OUT){
                        console.log(
                            "Evaluating spawnIf:",
                            workRoom,
                            typeof pop.spawnIf
                        );
                    }
                    if (!pop.spawnIf(sCreep)) {
                        break;
                    }
                    
                }

                //Add to queue
                qPopulation++;
                console.log("Adding " + role + " creep, with work room " + workRoom + ", to " + this.roomName + "'s build queue.");
                Memory.rooms[this.roomName].spawnQueue.push(sCreep);
            }
        }
        if(Memory.rooms[this.roomName].spawnQueue.length > 0){
            console.log("Finished checking population. Queue size: " + Memory.rooms[this.roomName].spawnQueue.length + " for room " + this.roomName + ".");
        } 
        else{
            console.log("Finished checking population. No creeps queued for room " + this.roomName + ".");
        }
    }

}

module.exports = SpawnManager;
