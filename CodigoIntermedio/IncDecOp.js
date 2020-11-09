const tsObject = require('./tsObject')
const Operation = require('./Operation')

class IncDecOp {
    constructor(exp,op) {
        this.exp = exp;
        this.op = op;
    }

    translate(scope,returnlbl,breaklbl,continuelbl) {
        let E = new tsObject(0,0,1,'number');
        let Op = new Operation(this.exp,E,this.op,0,0);
        if(this.exp.constructor.name == 'Id') {

            let id = this.exp.id;
            let r = Op.translate(scope,returnlbl,breaklbl,continuelbl);
            let searchId = scope.findVariable(id);

            if(searchId) {
                let newTsObject = new tsObject(0,0,null,null)
                //COMPROBACION DE TIPOS
                if(searchId.type != r.type ) {
                    console.log("ERROR en los tipos")
                    return null;
                }
                newTsObject.code3d += r.code3d;
                newTsObject.code3d += 'Stack[(int)'+searchId.pointer+'] = '+r.pointer+' ;\n'
                return newTsObject;

            } else {
                console.log("ERROR en el id")
                return null;
            }

        }
        return Op.translate(scope,returnlbl,breaklbl,continuelbl);
        
    }

}
module.exports = IncDecOp;
