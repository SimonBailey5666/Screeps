var collect = require('function.collect');

// Hauler:
// 1. Go to work room
// 2. Withdraw energy from a container
// 3. Return to home room
// 4. Deposit energy into extensions/spawns/towers/storage
// 5. Repeat

var roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {

        /*
         * =========================
         * STATE CHANGES
         * =========================
         */

        // Finished delivering -> go collect again
        if (
            creep.memory.working &&
            creep.store[RESOURCE_ENERGY] === 0
        ) {
            creep.memory.working = false;
            delete creep.memory.target;
        }

        // Finished collecting -> go deliver
        if (
            !creep.memory.working &&
            creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0
        ) {
            creep.memory.working = true;
            delete creep.memory.target;
        }


        /*
         * =========================
         * COLLECT ENERGY
         * =========================
         */

        if (!creep.memory.working) {

            /*
             * IMPORTANT:
             *
             * Only check whether we're actually in
             * the work room.
             *
             * Do NOT use atExit() here. A creep can
             * legitimately be standing on the room
             * edge after crossing into the work room.
             */

            if (creep.room.name !== creep.memory.work) {

                creep.moveTo(
                    new RoomPosition(
                        25,
                        25,
                        creep.memory.work
                    ),
                    {
                        reusePath: PATH_TICK_RECALC
                    }
                );

                return;
            }


            /*
             * We're now definitely in the work room.
             *
             * Find a container containing energy.
             */
            if (!creep.memory.target) {

                var containers = creep.room.find(
                    FIND_STRUCTURES,
                    {
                        filter: structure =>
                            structure.structureType === STRUCTURE_CONTAINER &&
                            structure.store.getUsedCapacity(
                                RESOURCE_ENERGY
                            ) > 0
                    }
                );

                if (containers.length > 0) {

                    var target = common.setTarget(
                        creep,
                        containers
                    );

                    if (target) {
                        creep.memory.target = target;
                    }
                }
            }


            /*
             * Withdraw from selected container.
             */
            if (creep.memory.target) {

                var container = Game.getObjectById(
                    creep.memory.target
                );

                // Target no longer exists
                if (!container) {
                    delete creep.memory.target;
                    return;
                }

                // Target is empty
                if (
                    container.store.getUsedCapacity(
                        RESOURCE_ENERGY
                    ) === 0
                ) {
                    delete creep.memory.target;
                    return;
                }

                var result = creep.withdraw(
                    container,
                    RESOURCE_ENERGY
                );

                if (result === ERR_NOT_IN_RANGE) {

                    creep.moveTo(container, {
                        reusePath: PATH_TICK_RECALC
                    });
                }

                return;
            }


            /*
             * No container available.
             * Fall back to dropped energy.
             */
            collect.pickupEnergy(creep);

            return;
        }


        /*
         * =========================
         * DELIVER ENERGY
         * =========================
         */

        /*
         * Same important fix here:
         *
         * Only travel toward the home room if
         * we're actually outside the home room.
         *
         * Don't use atExit() as a reason to
         * change rooms.
         */
        if (creep.room.name !== creep.memory.home) {

            creep.moveTo(
                new RoomPosition(
                    25,
                    25,
                    creep.memory.home
                ),
                {
                    reusePath: PATH_TICK_RECALC
                }
            );

            return;
        }


        /*
         * Nothing to deliver.
         */
        if (creep.store[RESOURCE_ENERGY] === 0) {

            creep.memory.working = false;
            delete creep.memory.target;

            return;
        }


        /*
         * =========================
         * FIND DELIVERY TARGET
         * =========================
         */

        if (!creep.memory.target) {

            var targets = creep.room.find(
                FIND_STRUCTURES,
                {
                    filter: structure => {

                        /*
                         * Extensions
                         */
                        if (
                            structure.structureType ===
                                STRUCTURE_EXTENSION
                        ) {
                            return structure.store.getFreeCapacity(
                                RESOURCE_ENERGY
                            ) > 0;
                        }

                        /*
                         * Spawns
                         */
                        if (
                            structure.structureType ===
                                STRUCTURE_SPAWN
                        ) {
                            return structure.store.getFreeCapacity(
                                RESOURCE_ENERGY
                            ) > 0;
                        }

                        /*
                         * Towers
                         */
                        if (
                            structure.structureType ===
                                STRUCTURE_TOWER
                        ) {
                            return structure.store.getFreeCapacity(
                                RESOURCE_ENERGY
                            ) > 0;
                        }

                        /*
                         * Storage
                         */
                        if (
                            structure.structureType ===
                                STRUCTURE_STORAGE
                        ) {
                            return structure.store.getFreeCapacity(
                                RESOURCE_ENERGY
                            ) > 0;
                        }

                        return false;
                    }
                }
            );

            if (targets.length > 0) {

                var target = common.setTarget(
                    creep,
                    targets
                );

                if (target) {
                    creep.memory.target = target;
                }
            }
        }


        /*
         * =========================
         * DELIVER
         * =========================
         */

        if (creep.memory.target) {

            var targetStructure = Game.getObjectById(
                creep.memory.target
            );

            /*
             * Target disappeared.
             */
            if (!targetStructure) {

                delete creep.memory.target;
                return;
            }


            /*
             * Target became full.
             */
            if (
                targetStructure.store.getFreeCapacity(
                    RESOURCE_ENERGY
                ) === 0
            ) {

                delete creep.memory.target;
                return;
            }


            var result = creep.transfer(
                targetStructure,
                RESOURCE_ENERGY
            );

            if (result === ERR_NOT_IN_RANGE) {

                creep.moveTo(targetStructure, {
                    reusePath: PATH_TICK_RECALC
                });
            }

            return;
        }


        /*
         * =========================
         * STORAGE FALLBACK
         * =========================
         */

        if (creep.room.storage) {

            var result = creep.transfer(
                creep.room.storage,
                RESOURCE_ENERGY
            );

            if (result === ERR_NOT_IN_RANGE) {

                creep.moveTo(
                    creep.room.storage,
                    {
                        reusePath: PATH_TICK_RECALC
                    }
                );
            }

            return;
        }
    }
};

module.exports = roleHauler;
