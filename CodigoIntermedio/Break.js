const tsObject = require('./tsObject');

class Break {
    constructor() {

    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        let newTsObject = new tsObject(0,0,null,null);
        newTsObject.code3d += 'goto '+breaklbl+';\n';
        return newTsObject;
    }
}
module.exports = Break;