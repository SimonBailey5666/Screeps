const spawncreep = require("function.spawncreep");
const POPS = require("roompop");

class SpawnManager {

    constructor(roomName) {
        this.roomName = roomName;
        this.room = Game.rooms[roomName];
        this.spawn = this.room.find(FIND_MY_SPAWNS)[0];

        // All creeps currently belong to W38S4
        this.home = roomName;
    }

    run() {
        if (this.spawn.spawning) {
            return ERR_BUSY;
        }

        const candidates = [];

        for (const workRoom in POPS) {

            const populations = POPS[workRoom];

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
                    creep.memory.home === this.home &&
                    creep.memory.work === workRoom
            ).length;
            
            //Check queue for any queued creeps
            const qPopulation = _.filter(
               Memory.rooms[this.roomName].spawnQueue,
                creep =>
                    creep.role === role &&
                    creep.locations.home === this.home &&
                    creep.locations.work === workRoom
            ).length; 

            if (population + qPopulation >= pop.max) {
                continue;
            }

            // Get the work room
            const workRoomObject = Game.rooms[workRoom];

            if (pop.spawnIf) {

                // Can't evaluate room-dependent conditions
                // without vision
                if (!workRoomObject) {
                    continue;
                }
                if(global.DEBUG_OUT){
                    console.log(
                        "Evaluating spawnIf:",
                        workRoom,
                        typeof pop.spawnIf
                    );
                }
                if (!pop.spawnIf(workRoomObject)) {
                    continue;
                }
            }
            //Add to queue
            var sCreep = {role: role, locations: {home: this.home, work: workRoom}};
            Memory.rooms[this.roomName].spawnQueue.push(sCreep);
        }

        return ERR_NOT_FOUND;
    }

}

module.exports = SpawnManager;
