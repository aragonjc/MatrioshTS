const tsObject = require('./tsObject');
const Operation = require('./Operation')
const Scope = require('./Scope')
const VariableChange = require('./VariableChange')


class For2 {
    constructor(id,exp,cond,iterate,stmt) {
        this.id = id;
        this.exp = exp;
        this.cond = cond;
        this.iterate = iterate;
        this.stmt = stmt;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {

        if(this.id.constructor.name == "Id") {
            
            
            let id = this.id.id;
            

            let Lloop = 'L'+scope.getNewLabel()
            let lbody = 'L' + scope.getNewLabel()
            let LExit = 'L' + scope.getNewLabel()
            let tempStack = 't' + scope.getNewTemp();
            let CONTINUELABEL = 'L'+scope.getNewLabel();

            let newTsObject = new tsObject(0,0,null,null);
            
            
            newTsObject.code3d += tempStack + '= P;\n';
            //let asignVar = new Variables(this.asign,this.id,new defLast({type:'number',list:0},this.expId),null);
            //let prevForScope = new Scope(scope,scope.terminal,scope.label);
            
            let chngVar = new VariableChange(id,{tipo:'=',value:this.exp});
            chngVar = chngVar.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);

            newTsObject.code3d +=  chngVar.code3d;
            newTsObject.code3d += Lloop + ':\n';
            let condT = this.cond.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
            newTsObject.code3d += condT.code3d;

            newTsObject.code3d += 'if(' + condT.pointer + ')goto '+lbody+';\n';
            newTsObject.code3d += 'goto '+LExit+';\n';
            newTsObject.code3d += lbody + ':\n';
            let newScope = new Scope(scope,scope.terminal,scope.label);
            
            let Statement = '';
            this.stmt.forEach(element => {
                Statement += element.translate(newScope,returnlbl,LExit,CONTINUELABEL,funcID,sCounter).code3d;
            });
            newTsObject.code3d += Statement;
            scope.terminal = newScope.terminal;
            scope.label = newScope.label;
            let iter = this.iterate.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
            newTsObject.code3d += CONTINUELABEL + ':\n';
            newTsObject.code3d += iter.code3d;
            newTsObject.code3d += 'goto '+Lloop+';\n';
            newTsObject.code3d += LExit + ':\n\n';
            
            
            newTsObject.code3d += 'P = '+tempStack+';\n';
            return newTsObject;
        }
    }
}
module.exports = For2;