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

                    //RECURSIVIDAD
                    if(funcID) {
                        if(funcID == this.id) {
                            for(let i = 0;i<func.paramsList.length;i++) {
                                let ptemp = 't' + scope.getNewTemp()
                                prevTemps.push(ptemp);
                                newTsObject.code3d += ptemp + '=Stack[(int)'+func.paramsList[i]+'];\n';
                                
                            }
                        }
                    }

                    let plist = '';
                    //let newTemp = 't' + scope.getNewTemp()
                    
                    //newTsObject.code3d += newTemp +'=P;\n';
                    for (let i = 0; i < this.paramFunc.length; i++) {
                        let obj = this.paramFunc[i].translate(scope,returnlbl,breaklbl,continuelbl,this.id,sCounter);
                        plist += obj.code3d;
                        plist += func.paramsList[i] + '=P;\n';
                        plist += 'Stack[(int)'+func.paramsList[i]+']='+obj.pointer+';\n';
                        plist += 'P = P + 1;\n';
                    }
                    
                    newTsObject.code3d += plist;
                    newTsObject.code3d += this.id + '();\n';
                    let funcs = scope.existsFunction(this.id);

                    if(funcs.returnValue == 0) {
                        
                        newTsObject.pointer = funcs.returnTemp;
                        newTsObject.type = funcs.type;
                    }
                    //newTsObject.code3d += 'P='+newTemp+';\n';

                    //RECURSIVIDAD
                    if(funcID) {
                        if(funcID == this.id) {
                            for(let i = 0;i<func.paramsList.length;i++) {
                                newTsObject.code3d += 'Stack[(int)'+func.paramsList[i]+']='+prevTemps[i]+';\n';
                            }
                        }
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