const tsObject = require('./tsObject');

class List {
    constructor(isArray,expOrId,auxP) {
        this.isArray = isArray;
        this.expOrId = expOrId;
        this.auxP = auxP;
        this.obj = null;
        this.cond = false;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {

        if(this.cond) {
            if(this.isArray) {

                const index = this.expOrId.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
                if(index.type == 'number') {
    
                    let counter = 't' + scope.getNewTemp();
                    let position = 't' + scope.getNewTemp();
                    let cond = 't' + scope.getNewTemp();
                    let pointer = 't' + scope.getNewTemp();
    
                    let startLabel = 'L' + scope.getNewLabel();
                    let valueLabel = 'L' + scope.getNewLabel();
                    let numberLabel = 'L' + scope.getNewLabel();
                    let booleanLabel = 'L' + scope.getNewLabel();
                    let stringLabel = 'L' + scope.getNewLabel();
                    let arrayLabel = 'L' + scope.getNewLabel();
                    let typeLabel = 'L' + scope.getNewLabel();
                    let primLabel = 'L' + scope.getNewLabel();
                    let exitLabel = 'L' + scope.getNewLabel();
                   
                    
    
    
                    let newTsObject = new tsObject(0,0,null,null);
                    newTsObject.type = this.obj.type;
                    newTsObject.code3d += this.obj.code3d;
                    newTsObject.pointer = pointer;
                    newTsObject.code3d += index.code3d;
                    newTsObject.code3d += counter + ' = 0;\n';
                    newTsObject.code3d += position + ' = '+this.obj.pointer+';\n';

                    newTsObject.code3d += startLabel + ':\n';
                    newTsObject.code3d += 'if('+index.pointer+'=='+counter+') goto '+valueLabel+';/////////\n';
                    newTsObject.code3d += counter + '='+counter+' +1;\n';
                    newTsObject.code3d += position + '='+position+' +2;\n';
                    newTsObject.code3d += 'goto '+startLabel+';\n';
                    newTsObject.code3d += valueLabel + ':\n';
                    newTsObject.code3d += cond +'=Heap[(int)'+position+'];\n';
                    //newTsObject.code3d += 'if('+cond+'==-1) goto '+numberLabel+';\n';
                    /*newTsObject.code3d += 'if('+cond+'==-2) goto '+booleanLabel+';\n';
                    newTsObject.code3d += 'if('+cond+'==-30) goto '+stringLabel+';\n';*/
                    newTsObject.code3d += 'if('+cond+'==-4) goto '+arrayLabel+';\n';
                    newTsObject.code3d += 'if('+cond+'==-5) goto '+typeLabel+';\n';
    
                    newTsObject.code3d += primLabel + ':\n';
                    newTsObject.code3d += position + '='+ position + '+1;\n';
                    newTsObject.code3d += pointer + ' = '+position+';\n'
                    newTsObject.code3d += 'goto '+exitLabel+';\n';
    
                    
                    newTsObject.code3d += arrayLabel + ':\n';
                    newTsObject.code3d += position + '='+ position + '+1;\n';
                    
                    if(this.auxP) {

                        newTsObject.code3d += pointer + '=Heap[(int)'+position+'];\n'
                        let outLabel = 'L' + scope.getNewLabel();
                        let endTemp = 't' + scope.getNewTemp();
                        if(this.obj.list.length > 0) {
                            newTsObject.isArray = true;
                            newTsObject.arrFinal = endTemp;
                            this.obj.list.forEach(element => {
                                newTsObject.code3d += endTemp + '='+element.fin+';\n';
                                newTsObject.code3d += 'if('+element.pointer+'=='+pointer+')goto '+outLabel+';\n';
                            });
                        }
                        newTsObject.code3d += outLabel + ':\n';

                    } else {
                        
                        newTsObject.code3d += pointer + '=Heap[(int)'+position+'];\n'
                    }

                    newTsObject.code3d += 'goto '+exitLabel+';\n';
    
    
                    newTsObject.code3d += typeLabel + ':\n';
                    newTsObject.code3d += position + '='+ position + '+1;\n';
                    //FALTA
                    newTsObject.code3d += 'goto '+exitLabel+';\n';
    
                    newTsObject.code3d += exitLabel + ':\n';
    
                    if(this.auxP) {
                        this.auxP.obj = newTsObject;
                        this.auxP.cond = true;
                        //console.log(newTsObject);
                        const auxPRes = this.auxP.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
                        //newTsObject.code3d += auxPRes.code3d;
                        //newTsObject.isArray = auxPRes.isArray;
                        //newTsObject.arrFinal = auxPRes.arrFinal;
                        //newTsObject.pointer = auxPRes.pointer;
                        
                        return auxPRes;
                    }
    
                    return newTsObject;
                } else {
                    console.log("La posicion del arreglo debe ser un tipo number");
                }
    
            } else {
    
            }
        } else {
            if(this.isArray) {

                const index = this.expOrId.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
                if(index.type == 'number') {
    
                    let counter = 't' + scope.getNewTemp();
                    let position = 't' + scope.getNewTemp();
                    let cond = 't' + scope.getNewTemp();
                    let pointer = 't' + scope.getNewTemp();
    
                    let startLabel = 'L' + scope.getNewLabel();
                    let valueLabel = 'L' + scope.getNewLabel();
                    let numberLabel = 'L' + scope.getNewLabel();
                    let booleanLabel = 'L' + scope.getNewLabel();
                    let stringLabel = 'L' + scope.getNewLabel();
                    let arrayLabel = 'L' + scope.getNewLabel();
                    let typeLabel = 'L' + scope.getNewLabel();
                    let primLabel = 'L' + scope.getNewLabel();
                    let exitLabel = 'L' + scope.getNewLabel();
                   
                    
    
    
                    let newTsObject = new tsObject(0,0,null,null);
                    newTsObject.type = this.obj.type;
                    newTsObject.code3d += this.obj.code3d;
                    newTsObject.pointer = pointer;
                    newTsObject.code3d += index.code3d;
                    newTsObject.code3d += counter + ' = 0;\n';
                    newTsObject.code3d += position + ' = '+this.obj.pointer+';\n';
                    newTsObject.code3d += startLabel + ':\n';
                    newTsObject.code3d += 'if('+index.pointer+'=='+counter+') goto '+valueLabel+';/////////\n';
                    newTsObject.code3d += counter + '='+counter+' +1;\n';
                    newTsObject.code3d += position + '='+position+' +2;\n';
                    newTsObject.code3d += 'goto '+startLabel+';\n';
                    newTsObject.code3d += valueLabel + ':\n';
                    newTsObject.code3d += cond +'=Heap[(int)'+position+'];\n';
                    //newTsObject.code3d += 'if('+cond+'==-1) goto '+numberLabel+';\n';
                    /*newTsObject.code3d += 'if('+cond+'==-2) goto '+booleanLabel+';\n';
                    newTsObject.code3d += 'if('+cond+'==-30) goto '+stringLabel+';\n';*/
                    newTsObject.code3d += 'if('+cond+'==-4) goto '+arrayLabel+';\n';
                    newTsObject.code3d += 'if('+cond+'==-5) goto '+typeLabel+';\n';
    
                    newTsObject.code3d += primLabel + ':\n';
                    newTsObject.code3d += position + '='+ position + '+1;\n';
                    newTsObject.code3d += pointer + '=Heap[(int)'+position+'];\n'
                    newTsObject.code3d += 'goto '+exitLabel+';\n';
    
                    
                    newTsObject.code3d += arrayLabel + ':\n';
                    newTsObject.code3d += position + '='+ position + '+1;\n';
                    newTsObject.code3d += pointer + '=Heap[(int)'+position+'];\n'
                    //newTsObject.code3d += pointer + '=Stack[(int)'+pointer+'];\n'
                    let outLabel = 'L' + scope.getNewLabel();
                    let endTemp = 't' + scope.getNewTemp();
    
                   // console.log(this.obj);
                    if(this.obj.list.length > 0) {
                        newTsObject.isArray = true;
                        newTsObject.arrFinal = endTemp;
                        this.obj.list.forEach(element => {
                            newTsObject.code3d += endTemp + '='+element.fin+';\n';
                            newTsObject.code3d += 'if('+element.pointer+'=='+pointer+')goto '+outLabel+';\n';
                        });
                    }
                    
                   
                    newTsObject.code3d += outLabel + ':\n';
                    newTsObject.code3d += 'goto '+exitLabel+';\n';
    
    
                    newTsObject.code3d += typeLabel + ':\n';
                    newTsObject.code3d += position + '='+ position + '+1;\n';
                    //FALTA
                    newTsObject.code3d += 'goto '+exitLabel+';\n';
    
                    newTsObject.code3d += exitLabel + ':\n';
    
                    if(this.auxP) {
                        this.auxP.obj = newTsObject;
                        //console.log(newTsObject);
                        const auxPRes = this.auxP.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
                        //newTsObject.code3d += auxPRes.code3d;
                        //newTsObject.isArray = auxPRes.isArray;
                        //newTsObject.arrFinal = auxPRes.arrFinal;
                        //newTsObject.pointer = auxPRes.pointer;
                        
                        return auxPRes;
                    }
    
                    return newTsObject;
                } else {
                    console.log("La posicion del arreglo debe ser un tipo number");
                }
    
            } else {
    
            }
        }

        

    }
}
module.exports = List;