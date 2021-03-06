const tsObject = require('./tsObject');

class defLast {
    constructor(type,value) {
        this.type = type;
        this.value = value;
    }
    
    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        const E = this.value.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        return {type:this.type.type,value:E,dim:this.type.list}
    }
}

module.exports = defLast;