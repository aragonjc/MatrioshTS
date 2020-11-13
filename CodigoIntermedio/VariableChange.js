const tsObject = require('./tsObject');
const Id = require('./Id')
const Operation = require('./Operation')

class VariableChange {
    constructor(id,asingLast) {
        this.id = id;
        this.asingLast = asingLast;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        
        const countP = Object.keys(this.asingLast).length;
        if(countP == 3) {
            
            const variableObj = scope.findVariable(this.id);
            if(variableObj) {

                let newObj = new Id(0,0,this.id);
                newObj = newObj.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);

                let varLast = this.asingLast.varLast;
                varLast.cond = true;
                varLast.obj = newObj;

                let r = varLast.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);

                let asingLastF = this.asingLast.asignLastF;
                //console.log(asingLastF);
                if(asingLastF.tipo == '=') {
                    const E = asingLastF.value.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
                    if(variableObj.type == E.type) {
                        let newCod3dObj = new tsObject(0,0,null,null);
                        newCod3dObj.code3d += r.code3d;
                        newCod3dObj.code3d += E.code3d;
                        if(E.isArray) {
                            
                            let originalTemp = 't'+ scope.getNewTemp();
                            let nuevoTemp = 't' + scope.getNewTemp();
                            let salidaNuevoTemp = 't' + scope.getNewTemp();
                            let auxTemp = 't' + scope.getNewTemp();

                            let lloopLabel = 'L'+scope.getNewLabel();
                            let exitLabel = 'L' + scope.getNewLabel();

                            newCod3dObj.code3d += originalTemp + '='+r.pointer+';\n';
                            newCod3dObj.code3d += nuevoTemp + '='+E.pointer+';\n';
                            newCod3dObj.code3d += salidaNuevoTemp + '='+E.arrFinal+';\n';

                            newCod3dObj.code3d += lloopLabel + ':\n';
                            newCod3dObj.code3d += 'if('+nuevoTemp+'=='+salidaNuevoTemp+') goto '+exitLabel+';\n';
                            newCod3dObj.code3d += auxTemp + '=Heap[(int)'+nuevoTemp+'];\n';
                            newCod3dObj.code3d += 'Heap[(int)'+originalTemp+']='+auxTemp+';\n';
                            newCod3dObj.code3d += originalTemp + '='+originalTemp+'+1;\n';
                            newCod3dObj.code3d += nuevoTemp + '='+nuevoTemp+'+1;\n';
                            newCod3dObj.code3d += 'goto '+lloopLabel+';\n';
                            newCod3dObj.code3d += exitLabel + ':\n';

                            

                        } else {
                            
                            
                            newCod3dObj.code3d += 'Heap[(int)'+r.pointer+']='+E.pointer+';\n'
                        }

                        newCod3dObj.isArray  = newObj.isArray;
                        newCod3dObj.pointer  = newObj.pointer;
                        newCod3dObj.type     = newObj.type;
                        newCod3dObj.arrFinal = newObj.arrFinal;
                        newCod3dObj.arrLen   = newObj.arrLen;
                        newCod3dObj.list     = newObj.list;
                        newCod3dObj.dim      = newObj.dim;

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

            

        } else {
            const variableObj = scope.findVariable(this.id);
            if(variableObj) {

                if(this.asingLast.tipo == '=') {
                    const E = this.asingLast.value.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
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
                    result = result.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);

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
                    result = result.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);

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
}
module.exports = VariableChange;