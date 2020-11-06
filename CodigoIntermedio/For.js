const tsObject = require('./tsObject')
const Scope = require('./Scope')
const Variables = require('./Variable')
const defLast = require('./defLast')
class For {
    constructor(asign,id,typeId,expId,cond,iterate,stmt) {
        this.asign = asign;
        this.id = id;
        this.expId = expId;
        this.typeId = typeId;
        this.cond = cond;
        this.iterate = iterate;
        this.stmt = stmt;
    }

    translate(scope) {
        
        
        let Lloop = 'L'+scope.getNewLabel()
        let lbody = 'L' + scope.getNewLabel()
        let LExit = 'L' + scope.getNewLabel()
        let tempStack = 't' + scope.getNewTemp();

        let newTsObject = new tsObject(0,0,null,null);
        
        //newTsObject.code3d += entryLabel + ':\n';
        newTsObject.code3d += tempStack + '= P;\n';
        let asignVar = new Variables(this.asign,this.id,new defLast({type:'number',list:0},this.expId),null);
        let prevForScope = new Scope(scope,scope.terminal,scope.label);
        asignVar = asignVar.translate(prevForScope);
        //scope.terminal = prevForScope.terminal;
        //scope.label = prevForScope.label;
        //let newScope = new Scope(prevForScope,prevForScope.terminal,prevForScope.label);
        newTsObject.code3d +=  asignVar.code3d;
        newTsObject.code3d += Lloop + ':\n';
        let condT = this.cond.translate(prevForScope);
        newTsObject.code3d += condT.code3d;

        newTsObject.code3d += 'if(' + condT.pointer + ')goto '+lbody+';\n';
        newTsObject.code3d += 'goto '+LExit+';\n';
        newTsObject.code3d += lbody + ':\n';
        let newScope = new Scope(prevForScope,prevForScope.terminal,prevForScope.label);
        
        let Statement = '';
        this.stmt.forEach(element => {
            Statement += element.translate(newScope).code3d;
        });
        newTsObject.code3d += Statement;
        prevForScope.terminal = newScope.terminal;
        prevForScope.label = newScope.label;

        let iter = this.iterate.translate(prevForScope);
        
        newTsObject.code3d += iter.code3d;
        newTsObject.code3d += 'goto '+Lloop+';\n';
        newTsObject.code3d += LExit + ':\n\n';
        
        scope.terminal = prevForScope.terminal;
        scope.label = prevForScope.label;
        
        newTsObject.code3d += 'P = '+tempStack+';\n';
        return newTsObject;
    }
}
module.exports = For;