const tsObject = require('./tsObject');
const Scope = require('./Scope')

class If {
    constructor(exp,stmt,iflast) {
        this.exp = exp;
        this.stmt = stmt;
        this.iflast = iflast;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID) {
        
        
        if(this.exp) {

            const E = this.exp.translate(scope,returnlbl,breaklbl,continuelbl,funcID);
            if(E.type == 'boolean' || E.type == 'number') {
                let newTsObj = new tsObject(0,0,null,null);
                newTsObj.code3d += E.code3d;
                let tLabel ='L'+ scope.getNewLabel();
                let fLabel ='L'+ scope.getNewLabel(); 
                let exitLabel = 'L'+scope.getNewLabel(); 
                newTsObj.code3d += 'if('+E.pointer+') goto '+tLabel+';\n'
                newTsObj.code3d += 'goto '+fLabel+';\n';
                newTsObj.code3d += tLabel + ':\n';

                const newScope = new Scope(scope,scope.terminal,scope.label)
                let Statement = '';
                this.stmt.forEach(element => {
                    Statement += element.translate(newScope,returnlbl,breaklbl,continuelbl,funcID).code3d;
                });
                scope.terminal = newScope.terminal;
                scope.label = newScope.label;

                newTsObj.code3d += Statement;
                newTsObj.code3d += 'goto '+exitLabel+';\n';
                newTsObj.code3d += fLabel + ':\n\n';
    
                if(this.iflast) {
                    const last = this.iflast.translate(scope,returnlbl,breaklbl,continuelbl,funcID);
                    newTsObj.code3d += last.code3d;
                }
                newTsObj.code3d += exitLabel + ':\n\n';
                
                return newTsObj;
            } else {
    
                console.error("ERROR");
                return null;
            }
        } else {
            const newScope = new Scope(scope,scope.terminal,scope.label)
            let st = '';
            this.stmt.forEach(element => {
                st += element.translate(newScope,returnlbl,breaklbl,continuelbl,funcID).code3d;
            });
            let Statement = new tsObject(0,0,null,null);
            Statement.code3d = st;
            scope.terminal = newScope.terminal;
            scope.label = newScope.label;
            
            return Statement;
        }

        
        
    }
}
module.exports = If;