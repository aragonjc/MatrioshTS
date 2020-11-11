const tsObject = require('./tsObject');
const Print = require('./Print')

class callFunction {
    constructor(id,Pl,paramFunc) {
        this.id = id;
        this.Pl = Pl;
        this.paramFunc = paramFunc;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        let func = scope.existsFunction(this.id);

        if(this.id == 'console') {
            const prnt = new Print(this.paramFunc,0);
            return prnt.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        } else {
            if(func) {

                //console.log(func);
                let newTsObject = new tsObject(0,0,null,null);
                if(this.paramFunc.length == func.paramsList.length) {
                    let prevTemps = [];
                    let StackC = 0;
                    //RECURSIVIDAD
                    let newTemp = 't' + scope.getNewTemp()
                    let palist;
                    let param;
                    if(funcID) {
                        if(funcID == this.id) {
                            palist = scope.getVariablesInFunc();
                            let auxTemp = 't'+scope.getNewTemp();
                            console.log(palist)
                            for(let i = 0;i<palist.length;i++) {
                                //let ptemp = 't' + scope.getNewTemp()
                                
                                newTsObject.code3d += auxTemp + '=P;\n';
                                //newTsObject.code3d += ptemp + '=Stack[(int)'+palist[i]+'];\n';
                                newTsObject.code3d += 'Stack[(int)'+auxTemp+'] = '+palist[i]+';\n';
                                newTsObject.code3d += 'P = P + 1;\n';
                                StackC++;
                                if(sCounter)
                                    sCounter++;                               
                            }
                            param = scope.getFunctionParameters();
                            console.log(param);
                            for(let i = 0;i<param.length;i++) {
                                let ptemp = 't' + scope.getNewTemp();
                                newTsObject.code3d += ptemp + ' = '+param[i]+';\n';
                                newTsObject.code3d += auxTemp +'=P;\n';
                                newTsObject.code3d += 'Stack[(int)'+auxTemp+']='+ptemp+';\n';
                                newTsObject.code3d += 'P = P + 1;\n';
                                StackC++;
                            }

                        } else {
                            newTsObject.code3d += newTemp +'=P;\n';
                        }
                    } else {
                        newTsObject.code3d += newTemp +'=P;\n';
                    }

                    let plist = '';
                         
                    for (let i = 0; i < this.paramFunc.length; i++) {
                        let obj = this.paramFunc[i].translate(scope,returnlbl,breaklbl,continuelbl,this.id,sCounter);
                        plist += obj.code3d;
                        plist += func.paramsList[i] + '=P;\n';
                        plist += 'Stack[(int)'+func.paramsList[i]+']='+obj.pointer+';\n';
                        plist += 'P = P + 1;\n';
                        StackC++;
                        if(sCounter)
                            sCounter++;
                    }
                    
                    newTsObject.code3d += plist;
                    newTsObject.code3d += this.id + '();\n';
                    let funcs = scope.existsFunction(this.id);

                    if(funcs.returnValue == 0) {
                        
                        let retTemp = 't'+scope.getNewTemp()
                        newTsObject.code3d += retTemp + '='+funcs.returnTemp+';\n';
                        newTsObject.pointer = retTemp;
                        newTsObject.type = funcs.type;
                        scope.tempList.push(retTemp);
                    }
                    

                    //RECURSIVIDAD
                    if(funcID) {
                        if(funcID == this.id) {
                            newTsObject.code3d += 'P = P - '+StackC+';\n';
                            let finalTemp = 't' + scope.getNewTemp();
                            StackC = 0;

                            
                            for(let i = 0;i<palist.length;i++) {
                                newTsObject.code3d += finalTemp + ' = P;\n';
                                newTsObject.code3d += palist[i] + ' = Stack[(int)'+finalTemp+'];\n';
                                newTsObject.code3d += 'P = P + 1;\n';
                                StackC++;
                            }
                            let auxTemp = 't'+scope.getNewTemp();
                            for(let i = 0;i<param.length;i++) {
                                let ptemp = 't' + scope.getNewTemp();

                                newTsObject.code3d += auxTemp +'=P;\n';
                                newTsObject.code3d += ptemp + '=Stack[(int)'+auxTemp+'];\n';
                                //newTsObject.code3d += 'Stack[(int)'+param[i]+']='+ptemp+';\n';
                                newTsObject.code3d += param[i] + '= '+ptemp+';\n';
                                newTsObject.code3d += 'P = P + 1;\n';
                                StackC++;
                            }

                            newTsObject.code3d += 'P = P - '+StackC+';\n';
                            if(sCounter)
                                sCounter=0;
                        } else {
                            newTsObject.code3d += 'P='+newTemp+';\n';
                        }
                    } else {
                        newTsObject.code3d += 'P='+newTemp+';\n';
                    }
                    return newTsObject;

                } else {
                    console.log("ERROR")
                }
            } else {
                console.log("ERROR la funcion no existe");
            }
        }
    }

}
module.exports = callFunction;