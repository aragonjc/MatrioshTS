const tsObject = require('./tsObject')

class Id {
    constructor(line,column,id) {
        this.line = line;
        this.column = column;
        this.id = id;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID) {
        let varRes = scope.findVariable(this.id);
        if(varRes == null) {
            console.log("ERROR en id")
        }

        let newTSObject = new tsObject(0,0,null,varRes.type);
        let newTemp = 't'+ scope.getNewTemp();
        newTSObject.code3d += newTemp+' = Stack[(int)' + varRes.pointer + '];\n';
        newTSObject.pointer = newTemp;
        
        return newTSObject
    }
}
module.exports = Id;    