var common = {
    atExit: function(pos) {
        return pos.x === 0 || pos.x === 49 || pos.y === 0 || pos.y === 49 || pos.x === 1 || pos.x === 48 || pos.y === 1 || pos.y === 48;
    },
    inWorkRoom: function(creep){
        return creep.memory.work === creep.room.name;
    },
    inHomeRoom: function(creep){
        return creep.memory.home === creep.room.name;
    }
};

module.exports = common;