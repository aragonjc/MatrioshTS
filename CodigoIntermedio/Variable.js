const defLast = require('./defLast');
const tsObject = require('./tsObject');

class Variable {
    constructor(asignType,id,deflast,defvarlast) {
        this.asignType = asignType;
        this.id = id;
        this.deflast = deflast;
        this.defvarlast = deflast;
    }

    translate(scope,returnlbl,breaklbl,continuelbl) {
        const objdef = this.deflast.translate(scope,returnlbl,breaklbl,continuelbl)
        let type = objdef.type;
        let valueType = objdef.value.type;
        let newObj = new tsObject(0,0,null,type);
        
        if(type == 'null') {
            
        } else if(type == valueType) {

            if(objdef.dim == 0) {
                
                if(scope.prev != null) {
                    
                    newObj.code3d += objdef.value.code3d;
                    let newTemp = 't'+scope.getNewTemp();
                    let saveTemp = 't'+scope.getNewTemp();
                    newObj.code3d += newTemp + '=P + '+scope.prevSize+';\n';
                    newObj.code3d += newTemp + '='+newTemp+' + '+scope.getSize()+';\n';
                    newObj.code3d += saveTemp + '=' + objdef.value.pointer + ';\n';
                    newObj.code3d += 'Stack[(int)'+newTemp+'] = ' + saveTemp + ';\n';
                    //newObj.code3d += 'P = P +1;\n';
                    scope.insertVariable(this.id,newTemp,type,false,0);
                } else {
                    newObj.code3d += objdef.value.code3d;
                    let newTemp = 't'+scope.getNewTemp();
                    let saveTemp = 't'+scope.getNewTemp();
                    newObj.code3d += newTemp + '=P;\n';
                    newObj.code3d += saveTemp + '=' + objdef.value.pointer + ';\n';
                    newObj.code3d += 'Stack[(int)'+newTemp+'] = ' + saveTemp + ';\n';
                    newObj.code3d += 'P = P +1;\n';
                    scope.insertVariable(this.id,newTemp,type,false,0);
                }
                
                return newObj;
            }
        } else {
            console.log("ERROR los tipos no son iguales");
        }
    }
}

module.exports = Variable;