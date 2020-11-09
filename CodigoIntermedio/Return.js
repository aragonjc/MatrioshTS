const tsObject = require('./tsObject')

class Return {
    constructor(value) {
        this.value = value;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID) {
        if(value) {

        } else {
            let newTsObject = new tsObject(0,0,null,null);
            newTsObject.code3d += 'goto '+returnlbl + ';\n';
            return newTsObject;
        }
    }
}
module.exports = Return;