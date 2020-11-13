const tsObject = require('./tsObject');
const Scope = require('./Scope');

class While {
    constructor(line,column,exp,stmt) {
        this.line = line;
        this.column = column;
        this.exp = exp;
        this.stmt = stmt;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {

        let entryLabel = 'L'+scope.getNewLabel();
        let exitLabel = 'L'+scope.getNewLabel();
        let bodyLabel = 'L'+scope.getNewLabel();
        let tempStack = 't' + scope.getNewTemp();

        let newTsObject = new tsObject(0,0,null,null);
        let E;
        let Statement = '';

        newTsObject.code3d += tempStack + '= P;\n';
        newTsObject.code3d += entryLabel + ':\n';
        E = this.exp.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        newTsObject.code3d += E.code3d;
        newTsObject.code3d += 'if('+E.pointer+') goto '+bodyLabel+';\n'
        newTsObject.code3d += 'goto '+exitLabel+';\n'
        newTsObject.code3d += bodyLabel + ':\n';
        let newScope = new Scope(scope,scope.terminal,scope.label);

        this.stmt.forEach(element => {
            Statement += element.translate(newScope,returnlbl,exitLabel,entryLabel,funcID,sCounter).code3d;
        });
        //Statement = this.stmt.translate(newScope)
        newTsObject.code3d += Statement

        scope.terminal = newScope.terminal;
        scope.label = newScope.label;

        newTsObject.code3d += 'goto '+entryLabel+';\n'
        newTsObject.code3d += exitLabel + ':\n\n';
        newTsObject.code3d += 'P = '+tempStack+';\n';
        return newTsObject;
    }
}
module.exports = While;