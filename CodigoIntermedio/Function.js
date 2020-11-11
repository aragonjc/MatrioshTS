const tsObject = require('./tsObject');
const Scope = require('./Scope')

class Function {
    constructor(id,params,funcdec) {
        this.id = id;
        this.params = params;
        this.funcdec = funcdec;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID) {
        
        const ftype = this.funcdec.type;
        const type = ftype.type;
        const list = ftype.list;
        const stmt = this.funcdec.stmt
        
        const newScope = new Scope(scope,scope.terminal,scope.label);
        //console.log(this.params);
        let paramsList = [];
        const returnTemp = 't' + newScope.getNewTemp()
        this.params.forEach(element => {

            const newTemp = 't'+newScope.getNewTemp();
            const paramId = element.id;
            const paramType = element.types.type;
            const paramDim = element.types.list;
            paramsList.push(newTemp);
            newScope.insertVariable(paramId,newTemp,paramType,false,paramDim);

        });
        
        scope.insertFunction(this.id,type,list,paramsList,returnTemp); 

        let newTsObject = new tsObject(0,0,null,null);
        let returnLabel = 'L'+ newScope.getNewLabel()
        newTsObject.code3d += 'void ' + this.id + '(){\n';
        let StatementCod3d = '';

        //console.log(scope.funcTable);

        stmt.forEach(element => {
            StatementCod3d += element.translate(newScope,returnLabel,breaklbl,continuelbl,this.id).code3d;
        });
        newTsObject.code3d += StatementCod3d;
        newTsObject.code3d += returnLabel + ':\n';
        newTsObject.code3d += 'return;\n'
        newTsObject.code3d += '}\n';
        
        scope.terminal = newScope.terminal;
        scope.label = newScope.label;

        return newTsObject
    }
}
module.exports = Function;