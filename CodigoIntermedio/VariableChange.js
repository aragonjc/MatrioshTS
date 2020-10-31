const tsObject = require('./tsObject');

class VariableChange {
    constructor(id,asingLast) {
        this.id = id;
        this.asingLast = asingLast;
    }

    translate(scope) {
        
        const variableObj = scope.findVariable(this.id);
        if(variableObj) {

            if(this.asingLast.tipo == '=') {
                const E = this.asingLast.value.translate(scope);
                if(variableObj.type == E.type) {
                    
                    let newCod3dObj = new tsObject(0,0,null,null);
                    newCod3dObj.code3d += E.code3d;
                    newCod3dObj.code3d += 'Stack[(int)'+variableObj.pointer+']='+E.pointer+';\n'
                    
                    return newCod3dObj;
                    
                } else if(E.type == 'null') {

                } else {
                    console.log("ERROR");
                    return null;
                }
            } 

        } else {
            console.log("ERROR La variable no existe")
            return null;
        }
    }
}
module.exports = VariableChange;