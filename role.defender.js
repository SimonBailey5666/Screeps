var common = require('function.common');

var roleDefender = {

    run: function(creep) {

        /*
         * =========================
         * COMBAT
         * =========================
         */

        // Acquire a target if we don't have one
        if (!creep.memory.hostile) {

            const hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);

            if (hostile) {
                creep.memory.hostile = hostile.id;
            }
        }

        // We have a target
        if (creep.memory.hostile) {

            const hostile = Game.getObjectById(creep.memory.hostile);

            // Target died / no longer exists
            if (!hostile) {
                delete creep.memory.hostile;
            }
            else {

                // Target is in another room
                if (hostile.pos.roomName !== creep.room.name) {

                    creep.moveTo(hostile, {
                        reusePath: 5
                    });

                }
                // Target is in our room
                else {

                    const result = creep.attack(hostile);

                    if (result === ERR_NOT_IN_RANGE) {
                        creep.moveTo(hostile, {
                            reusePath: 5
                        });
                    }
                }

                return;
            }
        }


        /*
         * =========================
         * SQUAD
         * =========================
         */

        if (!creep.memory.inSquad) {

            if (this.findSquad(
                creep.memory.home,
                creep.memory.work
            )) {

                creep.memory.inSquad = true;

                if (
                    creep.memory.working &&
                    creep.carry.energy === 0
                ) {
                    creep.memory.working = false;
                    creep.say('Moving out!');
                }
            }
        }


        /*
         * =========================
         * MOVE TO WORK ROOM
         * =========================
         */

        if (
            (!common.inWorkRoom(creep) ||
            common.atExit(creep.pos)) &&
            creep.memory.inSquad
        ) {

            creep.moveTo(
                new RoomPosition(
                    25,
                    25,
                    creep.memory.work
                ),
                {
                    reusePath: 10
                }
            );
        }
    },


    findSquad: function(home, work) {

        const defenders = _.filter(
            Game.creeps,
            creep =>
                creep.memory.role === 'defender' &&
                creep.pos.roomName === home &&
                creep.memory.work === work
        ).length;

        return defenders >= 4;
    }

};

module.exports = roleDefender;
