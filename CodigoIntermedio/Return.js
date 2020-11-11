const tsObject = require('./tsObject')

class Return {
    constructor(value) {
        this.value = value;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        
        if(this.value) {
            
            //id 
            //
            const func = scope.existsFunction(funcID);
            
            func.returnValue = 0;
            scope.changeFunction(funcID,func)
            console.log("ESTO ES EN RETURN");
            console.log(this.value)
            console.log("%%%%%%%%%%%%%%%%%%%%%")

            const rexp = this.value.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            
            
            let newTsObject = new tsObject(0,0,null,null);
            newTsObject.code3d += rexp.code3d;
            //let newTemp = 't'+scope.getNewTemp()

            newTsObject.code3d += func.returnTemp + ' = '+rexp.pointer+';\n';
            //newTsObject.code3d += func.returnTemp + '= P;\n';
            //newTsObject.code3d += 'Stack[(int)'+func.returnTemp+'] ='+newTemp+';\n';
            //newTsObject.code3d += 'P=P+1;\n';
            newTsObject.code3d += 'goto '+returnlbl + ';\n';

            return newTsObject;


        } else {
            let newTsObject = new tsObject(0,0,null,null);
            newTsObject.code3d += 'goto '+returnlbl + ';\n';
            return newTsObject;
        }
    }
}
module.exports = Return;