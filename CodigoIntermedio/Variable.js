const defLast = require('./defLast');
const tsObject = require('./tsObject');

class Variable {
    constructor(asignType,id,deflast,defvarlast) {
        this.asignType = asignType;
        this.id = id;
        this.deflast = deflast;
        this.defvarlast = deflast;
    }

    translate(scope) {
        const objdef = this.deflast.translate(scope)
        let type = objdef.type;
        let newObj = new tsObject(0,0,null,type);
        if(type == 'null') {

        } else if(type == this.asignType) {
            
            if(type == 'string') {

            } else {
                if(objdef.dim == 0) {

                    newObj.code3d += objdef.value.code3d;
                    let newTemp = 't'+scope.getNewTemp();
                    let saveTemp = 't'+scope.getNewTemp();
                    newObj.code3d += newTemp + '=P;\n';
                    newObj.code3d += saveTemp + '=' + objdef.value.pointer + ';\n';
                    newObj.code3d += 'Stack[(int)'+newTemp+'] = ' + saveTemp + ';\n';
                    newObj.code3d += 'P = P +1;\n';
                    scope.insertVariable(this.id,newTemp,type,false,0);

                    return newObj;
                }
            }

        } else {
            console.log("ERROR los tipos no son iguales");
        }
    }
}

module.exports = Variable;