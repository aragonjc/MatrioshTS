const tsObject = require('./tsObject');

class ArrList {
    constructor(param) {
        this.param = param;
        
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        
        let newTsObject = new tsObject(0,0,null,null)
        newTsObject.isArray = true;
        let res = null;
        let pointer = 't' + scope.getNewTemp();
        let aux = 't' + scope.getNewTemp();
        
        
        let arrs = [];

        this.param.forEach(element => {
            res = element.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
            newTsObject.code3d += res.code3d;

            

            let typel = '';
            if(res.isArray) {
                typel = '-4';
                newTsObject.list.push({fin:res.arrFinal,tipo:res.type,len:res.arrLen,pointer:res.pointer});
            } else if(res.isType) {
                typel = '-5';
            }else if(res.type == 'number') {
                typel = '-1';
            } else if(res.type == 'boolean') {
                typel = '-2';
            } else if (res.type == 'string') {
                typel = '-30';
            } 
            arrs.push({type:typel,pointer:res.pointer});
            
            
        });
        newTsObject.arrLen = this.param.length;

        newTsObject.code3d += "//=================ARRLIST==========================\n";

        newTsObject.code3d += pointer + '=H;\n';
        newTsObject.code3d += aux + '=H;\n';
        arrs.forEach(element => {
            newTsObject.code3d += 'Heap[(int)'+aux+'] = '+element.type+';\n';
            newTsObject.code3d += 'H = H + 1;\n';
            newTsObject.code3d += aux + ' = H;\n';
            ////////////////////////////////
            newTsObject.code3d += 'Heap[(int)'+aux+'] = '+element.pointer+';\n';
            newTsObject.code3d += 'H = H + 1;\n';
            newTsObject.code3d += aux + ' = H;\n';
        });

            
        let lastPosition = 't' + scope.getNewTemp();
        //newTsObject.code3d += lastPosition + ' = ' + aux + ' - 1;\n';
        newTsObject.code3d += lastPosition + ' = ' + aux + ';\n';
        newTsObject.arrFinal = lastPosition; 
        newTsObject.type = res.type;

        /*let newPointer = 't' + scope.getNewTemp();
        newTsObject.code3d += newPointer + ' = P;\n';
        newTsObject.code3d += 'Stack[(int)'+newPointer+'] = '+pointer+';\n';
        newTsObject.code3d += 'P = P + 1;\n';
        newTsObject.pointer = newPointer;*/
        newTsObject.pointer = pointer;
        
        newTsObject.code3d += "//===========================================\n";
        return newTsObject;

    }
}
module.exports = ArrList;
