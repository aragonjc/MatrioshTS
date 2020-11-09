const tsObject = require('./tsObject');
const Id = require('./Id')
const Operation = require('./Operation')

class VariableChange {
    constructor(id,asingLast) {
        this.id = id;
        this.asingLast = asingLast;
    }

    translate(scope,returnlbl,breaklbl,continuelbl) {
        
        const variableObj = scope.findVariable(this.id);
        if(variableObj) {

            if(this.asingLast.tipo == '=') {
                const E = this.asingLast.value.translate(scope,returnlbl,breaklbl,continuelbl);
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
            } else if(this.asingLast.tipo == '++' || this.asingLast.tipo == '--') {

                if(this.asingLast.tipo == '++') {
                    this.asingLast.tipo = '+'
                } else {
                    this.asingLast.tipo = '-'
                }

                let varObj = new Id(0,0,this.id);
                //let op2 = this.asingLast.value;
                let result =  new Operation(varObj,new tsObject(0,0,'1','number'),this.asingLast.tipo,0,0);
                result = result.translate(scope,returnlbl,breaklbl,continuelbl);

                if(variableObj.type == result.type) {
                    let newCod3dObj = new tsObject(0,0,null,null);
                    newCod3dObj.code3d += result.code3d;
                    newCod3dObj.code3d += 'Stack[(int)'+variableObj.pointer+']='+result.pointer+';\n'
                    
                    return newCod3dObj;

                } else {
                    console.log("ERROR tipos incorrectos");
                    return null;
                }
            } else {
                
                //obtengo el puntero de la variable
                //creo un nuevo temporal
                //con el puntero de la variable obtengo el valor en el STACK
                //y lo guardo en el temporal que cree
                //creo una nueva instancia de operacion y le paso el valor de la variable
                //y E
                
                let varObj = new Id(0,0,this.id);
                let op2 = this.asingLast.value;
                let result =  new Operation(varObj,op2,this.asingLast.tipo,0,0);
                result = result.translate(scope,returnlbl,breaklbl,continuelbl);

                if(variableObj.type == result.type) {
                    let newCod3dObj = new tsObject(0,0,null,null);
                    newCod3dObj.code3d += result.code3d;
                    newCod3dObj.code3d += 'Stack[(int)'+variableObj.pointer+']='+result.pointer+';\n'
                    
                    return newCod3dObj;

                } else {
                    console.log("ERROR tipos incorrectos");
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