const tsObject = require('./tsObject');

class If {
    constructor(exp,stmt,iflast) {
        this.exp = exp;
        this.stmt = stmt;
        this.iflast = iflast;
    }

    translate(scope) {
        
        const Statement = this.stmt.translate(scope);
        if(this.exp) {

            const E = this.exp.translate(scope);
            if(E.type == 'boolean' || E.type == 'number') {
                let newTsObj = new tsObject(0,0,null,null);
                newTsObj.code3d += E.code3d;
                let tLabel ='L'+ scope.getNewLabel();
                let fLabel ='L'+ scope.getNewLabel(); 
                let exitLabel = 'L'+scope.getNewLabel(); 
                newTsObj.code3d += 'if('+E.pointer+') goto '+tLabel+';\n'
                newTsObj.code3d += 'goto '+fLabel+';\n';
                newTsObj.code3d += tLabel + ':\n';
                newTsObj.code3d += Statement.code3d;
                newTsObj.code3d += 'goto '+exitLabel+';\n';
                newTsObj.code3d += fLabel + ':\n\n';
    
                if(this.iflast) {
                    const last = this.iflast.translate(scope);
                    newTsObj.code3d += last.code3d;
                }
                newTsObj.code3d += exitLabel + ':\n\n';
                
                return newTsObj;
            } else {
    
                console.error("ERROR");
                return null;
            }
        } else {
            return Statement;
        }

        
        
    }
}
module.exports = If;