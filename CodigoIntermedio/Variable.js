const defLast = require('./defLast');
const tsObject = require('./tsObject');

class Variable {
    constructor(asignType,id,deflast,defvarlast) {
        this.asignType = asignType;
        this.id = id;
        this.deflast = deflast;
        this.defvarlast = deflast;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        const objdef = this.deflast.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
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
                    //sCounter++;
                    scope.insertVariable(this.id,newTemp,type,false,0);
                }
                
                return newObj;
            } else {
                //console.log(objdef);
                if(scope.prev != null) {
                    
                    newObj.code3d += objdef.value.code3d;
                    let newTemp = 't'+scope.getNewTemp();
                    let saveTemp = 't'+scope.getNewTemp();
                    newObj.code3d += newTemp + '=P + '+scope.prevSize+';\n';
                    
                    newObj.code3d += newTemp + '='+newTemp+' + '+scope.getSize()+';\n';
                    newObj.code3d += saveTemp + '=' + objdef.value.pointer + ';\n';
                    newObj.code3d += 'Stack[(int)'+newTemp+'] = ' + saveTemp + ';\n';
                    //newObj.code3d += 'P = P +1;\n';
                    scope.insertVariable(this.id,newTemp,type,{list:objdef.value.list,arrFinal:objdef.value.arrFinal,len:objdef.value.arrLen,pointer:objdef.value.pointer},objdef.dim);
                } else {
                    newObj.code3d += objdef.value.code3d;
                    let newTemp = 't'+scope.getNewTemp();
                    let saveTemp = 't'+scope.getNewTemp();
                    newObj.code3d += newTemp + '=P;\n';
                    newObj.code3d += saveTemp + '=' + objdef.value.pointer + ';\n';
                    newObj.code3d += 'Stack[(int)'+newTemp+'] = ' + saveTemp + ';\n';
                    newObj.code3d += 'P = P +1;\n';
                    //sCounter++;
                    scope.insertVariable(this.id,newTemp,type,{list:objdef.value.list,arrFinal:objdef.value.arrFinal,len:objdef.value.arrLen,pointer:objdef.value.pointer},objdef.dim);
                }
                
                return newObj;
            }

        } else if(valueType == 'Array') {
            
            if(objdef.dim == 1) {

                let pointer = 't' + scope.getNewTemp();
                let index = 't' + scope.getNewTemp();
                let counterTemp = 't' + scope.getNewTemp();
                let condTemp = 't' + scope.getNewTemp();
                let auxTemp = 't'+scope.getNewTemp();

                let labelEntry = 'L' + scope.getNewLabel();
                //let fillArrayLabel = 'L' + scope.getNewLabel();
                let exitLabel = 'L'+ scope.getNewLabel();

                let newTsObject = new tsObject(0,0,null,null);
                newTsObject.code3d += objdef.value.code3d;
                newTsObject.code3d += pointer +' = H;\n';
                newTsObject.code3d += index +' = H;\n';
                newTsObject.code3d += counterTemp + '=0;\n';

                newTsObject.code3d += labelEntry + ':\n';
                newTsObject.code3d += auxTemp + ' = '+counterTemp+' + 1;\n'
                newTsObject.code3d += condTemp + '= ' + auxTemp + '=='+objdef.value.pointer + ';\n';
                newTsObject.code3d += 'if('+condTemp+') goto '+exitLabel+';\n';
                newTsObject.code3d += 'Heap[(int)'+index+'] = -100;\n';
                newTsObject.code3d += 'H = H + 1;\n';
                newTsObject.code3d += index +' = H;\n';
                newTsObject.code3d += counterTemp + ' = ' + counterTemp + ' + 1;\n';
                newTsObject.code3d += 'goto '+labelEntry+';\n';
                newTsObject.code3d += exitLabel + ':\n';
                //console.log(this.asignType)
                //id,pointer,type,len,dim
                
                //asignar a pointer del heap al stack
                if(scope.prev != null) {

                    let newTemp = 't'+scope.getNewTemp();
                    let saveTemp = 't'+scope.getNewTemp();
                    newObj.code3d += newTemp + '=P + '+scope.prevSize+';\n';
                    newObj.code3d += newTemp + '='+newTemp+' + '+scope.getSize()+';\n';
                    
                    newObj.code3d += saveTemp + '=' + pointer + ';\n';
                    newObj.code3d += 'Stack[(int)'+newTemp+'] = ' + saveTemp + ';\n';

                    scope.insertVariable(this.id,newTemp,type,[objdef.value.pointer],objdef.dim);
                } else {
                    
                    let newTemp = 't'+scope.getNewTemp();
                    let saveTemp = 't'+scope.getNewTemp();
                    newObj.code3d += newTemp + '=P;\n';
                    newObj.code3d += saveTemp + '=' + pointer + ';\n';
                    newObj.code3d += 'Stack[(int)'+newTemp+'] = ' + saveTemp + ';\n';
                    newObj.code3d += 'P = P +1;\n';
                    //newObj.pointer = newTemp;
                    scope.insertVariable(this.id,newTemp,type,[objdef.value.pointer],objdef.dim);
                
                }

                return newTsObject;
            } else {
                console.log("Error tamaño incorrecto");
            }

        } else {
            console.log("ERROR los tipos no son igualesP");
        }
    }
}

module.exports = Variable;