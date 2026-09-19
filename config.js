//Magic numbers
global.PATH_TICK_RECALC = 5; //Ticks before recalculating path
global.DEBUG_OUT = false;
global.DEFAULT_HOME = 'W38S4';
global.SQUAD_SIZE = 4;

//Defines creep types and pop
global.ROLES = ["harvester", "upgrader", "builder", "distributer", "defender", "miner", "hauler", "capturer", "scout", "tank", "healer"];

//weighted parts
global.TEMPLATES = {
    harvester: {
        parts: [3, 2, 2, 0, 0, 0, 0, 0],
        priority: 5
    },
    upgrader: {
        parts: [2, 3, 3, 0, 0, 0, 0, 0],
        priority: 7
    },
    builder: {
        parts: [1, 4, 3, 0, 0, 0, 0, 0],
        priority: 3
    },
    distributer: {
        parts: [0, 3, 3, 0, 0, 0, 0, 0],
        priority: 1
    },
    defender: {
        parts: [0, 1, 0, 0, 1, 0, 0, 0],
        priority: 1
    },
    miner: {
        parts: [5, 1, 1, 0, 0, 0, 0, 0],
        priority: 2
    },
    hauler: {
        parts: [0, 1, 2, 0, 0, 0, 0, 0],
        priority: 2
    },
    capturer: {
        parts: [0, 1, 0, 0, 0, 0, 1, 0],
        priority: 4
    },
    scout: {
        parts: [0, 1, 0, 0, 0, 0, 0, 0],
        priority: 5
    },
    tank: {
        parts: [0, 5, 0, 1, 0, 0, 0, 4],
        priority: 4
    },
    healer: {
        parts: [0, 1, 0, 0, 0, 1, 0, 0],
        priority: 5
    }
};

//parts = [ WORK, MOVE, CARRY, ATTACK, RANGED_ATTACK, HEAL, CLAIM, TOUGH];

global.ERROR_MESSAGES = {
    [OK]: 'Success',
    [ERR_NOT_OWNER]: 'Not owner',
    [ERR_NO_PATH]: 'No path',
    [ERR_NAME_EXISTS]: 'Name exists',
    [ERR_BUSY]: 'Busy',
    [ERR_NOT_FOUND]: 'Not found',
    [ERR_NOT_ENOUGH_RESOURCES]: 'Not enough resources',
    [ERR_INVALID_TARGET]: 'Invalid target',
    [ERR_FULL]: 'Full',
    [ERR_NOT_IN_RANGE]: 'Not in range',
    [ERR_INVALID_ARGS]: 'Invalid arguments',
    [ERR_TIRED]: 'Tired',
    [ERR_NO_BODYPART]: 'Missing required body part',
    [ERR_NOT_ENOUGH_EXTENSIONS]: 'Not enough extensions',
    [ERR_RCL_NOT_ENOUGH]: 'Room controller level too low',
    [ERR_GCL_NOT_ENOUGH]: 'Global controller level too low'
};
