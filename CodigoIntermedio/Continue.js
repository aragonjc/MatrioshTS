const tsObject = require('./tsObject');

class Continue {
    constructor() {

    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        let newTsObject = new tsObject(0,0,null,null);
        newTsObject.code3d += 'goto '+continuelbl+';\n';
        return newTsObject;
    }
}
module.exports = Continue;