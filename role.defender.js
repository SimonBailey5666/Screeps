var roleDefender = {
    
    run: function(creep){
        const hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        
        if(creep.attack(hostile) === ERR_NOT_IN_RANGE){
            creep.moveTo(hostile);
        }      
    } 
    
}

module.exports = roleDefender;