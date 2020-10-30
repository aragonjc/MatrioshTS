const tsObject = require('./tsObject');

class defLast {
    constructor(type,value) {
        this.type = type;
        this.value = value;
    }
    
    translate(scope) {
        const E = this.value.translate(scope);
        return {type:this.type.type,value:E,dim:this.type.list}
    }
}

module.exports = defLast;