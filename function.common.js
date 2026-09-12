var common = {
    atExit: function(pos) {
        return pos.x === 0 || pos.x === 49 || pos.y === 0 || pos.y === 49;
    },
    inWorkRoom: function(creep){
        return creep.memory.work === creep.room.name;
    },
    inHomeRoom: function(creep){
        return creep.memory.home === creep.room.name;
    }
};

module.exports = common;