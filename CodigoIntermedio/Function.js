const tsObject = require('./tsObject');
const Scope = require('./Scope')

class Function {
    constructor(id,params,funcdec) {
        this.id = id;
        this.params = params;
        this.funcdec = funcdec;
    }

    translate(scope,returnlbl,breaklbl,continuelbl) {
        
        const ftype = this.funcdec.type;
        const type = ftype.type;
        const list = ftype.list;
        const stmt = this.funcdec.stmt
        
        const newScope = new Scope(scope,scope.terminal,scope.label);
        //console.log(this.params);
        let paramsList = [];
        this.params.forEach(element => {
            const newTemp = 't'+newScope.getNewTemp();
            const paramId = element.id;
            const paramType = element.types.type;
            const paramDim = element.types.list;
            paramsList.push(newTemp);
            newScope.insertVariable(paramId,newTemp,paramType,paramDim);

        });
        
        scope.terminal = newScope.terminal;
        scope.label = newScope.label;
        
        scope.insertFunction(this.id,type,list,paramsList); 

        let newTsObject = new tsObject(0,0,null,null);
        let returnLabel = 'L'+ scope.getNewLabel()
        newTsObject.code3d += 'void ' + this.id + '(){\n';

        newTsObject.code3d += returnLabel + ':\n';
        newTsObject.code3d += '}\n';
        
        return newTsObject
    }
}
module.exports = Function;