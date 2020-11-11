const tsObject = require('./tsObject');

class Ternary {
    constructor(exp1,exp2,exp3) {
        this.exp1 = exp1;
        this.exp2 = exp2;
        this.exp3 = exp3;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {

        const cond = this.exp1.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        const expTrue = this.exp2.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        const expFalse = this.exp3.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);

        let tLabel ='L'+ scope.getNewLabel();
        let fLabel ='L'+ scope.getNewLabel(); 
        let exitLabel = 'L'+scope.getNewLabel(); 
        let pointer = 't' + scope.getNewTemp();

        let newTsObject = new tsObject(0,0,null,null);
        newTsObject.code3d += cond.code3d;
        newTsObject.code3d += 'if('+cond.pointer+') goto '+tLabel+';\n';
        newTsObject.code3d += 'goto '+fLabel+';\n';

        newTsObject.code3d += tLabel + ':\n';
        newTsObject.code3d += expTrue.code3d;
        newTsObject.code3d += pointer + ' = '+expTrue.pointer+';\n';
        newTsObject.code3d += 'goto '+exitLabel+';\n';

        newTsObject.code3d += fLabel + ':\n';
        newTsObject.code3d += expFalse.code3d;
        newTsObject.code3d += pointer + ' = '+expFalse.pointer+';\n';
        newTsObject.code3d += 'goto '+exitLabel+';\n';

        newTsObject.code3d += exitLabel + ':\n\n';
        newTsObject.pointer = pointer;

        return newTsObject;
    }
}
module.exports = Ternary;