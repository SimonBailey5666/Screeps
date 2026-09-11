const spawncreep = require("function.spawncreep");
const POPS = require("roompop");

class SpawnManager {

    constructor(spawn) {
        this.spawn = spawn;
        this.room = spawn.room;

        // All creeps currently belong to W38S4
        this.home = "W38S4";
    }

    run() {

        if (this.spawn.spawning) {
            return ERR_BUSY;
        }

        // Iterate over work rooms
        for (const workRoom in POPS) {

            const populations = POPS[workRoom];

            // Iterate over roles for this work room
            for (const role in populations) {

                const pop = populations[role];
                const template = TEMPLATES[role];

                if (!template) {
                    console.log(
                        `SpawnManager: No template for ${role}`
                    );
                    continue;
                }

                // Count role + home + work
                const population = _.filter(
                    Game.creeps,
                    creep =>
                        creep.memory.role === role &&
                        creep.memory.home === this.home &&
                        creep.memory.work === workRoom
                ).length;

                if (population >= pop.max) {
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

                    if (!pop.spawnIf(workRoomObject)) {
                        continue;
                    }
                }

                const result = spawncreep.workercreep(
                    this.spawn,
                    role,
                    this.room.energyAvailable,
                    {
                        home: this.home,
                        work: workRoom
                    }
                );

                if (result === OK) {
                    return OK;
                }
            }
        }

        return ERR_NOT_FOUND;
    }
}

module.exports = SpawnManager;
