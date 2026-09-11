class ScreepRole {
    constructor(creep) {
        this.creep = creep;

        const roleName = creep.memory.role;
        this.role = require("role." + roleName);
    }

    run() {
        this.role.run(this.creep);
    }
}

module.exports = ScreepRole;