const tsObject = require('./tsObject')

class Id {
    constructor(line,column,id) {
        this.line = line;
        this.column = column;
        this.id = id;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        let varRes = scope.findVariable(this.id);
        if(varRes == null) {
            console.log("ERROR en id")
        }
        //console.log(varRes);

        let newTSObject = new tsObject(0,0,null,varRes.type);
        if(varRes.dimention > 0) {
            let newTemp = 't'+ scope.getNewTemp();
            let pointer = 't' + scope.getNewTemp();

            newTSObject.isArray = true;
            newTSObject.code3d += newTemp+' = ' + varRes.pointer + ';\n';
            newTSObject.code3d += pointer + '=Stack[(int)' + newTemp + '];\n';
            newTSObject.pointer = pointer;
            newTSObject.list = varRes.length.list;
            newTSObject.arrFinal = varRes.length.arrFinal;
            scope.tempList.push(newTemp);
            console.log(newTSObject);

        } else {
            let newTemp = 't'+ scope.getNewTemp();
            newTSObject.code3d += newTemp+' = Stack[(int)' + varRes.pointer + '];\n';
            newTSObject.pointer = newTemp;
            scope.tempList.push(newTemp);
        }
        
        
        return newTSObject
    }
}
module.exports = Id;    