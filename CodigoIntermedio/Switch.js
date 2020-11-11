const Scope = require('./Scope');
const tsObject = require('./tsObject')
const Relational = require('./Relational')

class Switch {
    constructor(exp,firstcase,lastcase) {
        this.exp = exp;
        this.firstcase = firstcase;
        this.lastcase = lastcase;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID) {

        let newTsObject = new tsObject(0,0,null,null);

        let Labels = [];
        let deflabel = '';

        let lxLabel = 'L' + scope.getNewLabel();
        let lfinLabel = 'L' + scope.getNewLabel();

        newTsObject.code3d += 'goto '+lxLabel+';\n';

        if(this.firstcase != null) {
            this.firstcase.forEach(element => {
                
                let bodyCase = '';
                let actualLabel = 'L' + scope.getNewLabel();
                Labels.push(actualLabel);
                newTsObject.code3d += actualLabel + ':\n';

                element.stmt.forEach(obj => {
                    
                    let newScope = new Scope(scope,scope.terminal,scope.label);
                    bodyCase += obj.translate(newScope,returnlbl,lfinLabel,continuelbl,funcID).code3d;
                    scope.terminal = newScope.terminal;
                    scope.label = newScope.label;
                })
                newTsObject.code3d += bodyCase;

            });
        }

        let stat = '';
        let deflbl = 'L' + scope.getNewLabel();
        newTsObject.code3d += deflbl + ':\n';

        this.lastcase.forEach(obj => {
            let newScope = new Scope(scope,scope.terminal,scope.label);
            stat += obj.translate(newScope,returnlbl,breaklbl,continuelbl,funcID).code3d;
            scope.terminal = newScope.terminal;
            scope.label = newScope.label;
        });
        newTsObject.code3d += stat;
        newTsObject.code3d += 'goto '+lfinLabel+';\n';
        newTsObject.code3d += lxLabel + ':\n';

        let index = 0;
        this.firstcase.forEach(element => {

            let cond =  new Relational(this.exp,element.exp,'==',0,0);
            cond = cond.translate(scope,returnlbl,breaklbl,continuelbl,funcID)
            newTsObject.code3d += cond.code3d;
            newTsObject.code3d += 'if('+cond.pointer+')goto '+Labels[index]+';\n';
            index++;

        });

        newTsObject.code3d += 'goto '+deflbl+';\n';
        newTsObject.code3d += lfinLabel + ':\n';


        return newTsObject;

    }

}
module.exports = Switch;