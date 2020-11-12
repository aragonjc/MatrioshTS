const tsObject = require('./tsObject');

class Arrayl {
    constructor(id,exp) {
        this.id = id;
        this.exp = exp;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {

        if(this.id == "Array") {

            const E = this.exp.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
            if(E.type == 'number') {
                let newTsObject = new tsObject(0,0,null,null)
                newTsObject.type = 'Array'
                let x = 't' + scope.getNewTemp();
                newTsObject.code3d += E.code3d; 
                newTsObject.code3d += x + ' = '+E.pointer+';\n';
                newTsObject.pointer = x;
                return newTsObject;
            }

        } else {
            console.log("ERROR");
        }
        return null;
    }
}
module.exports = Arrayl;