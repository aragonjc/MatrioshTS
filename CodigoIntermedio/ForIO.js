const tsObject = require('./tsObject');
const Variables = require('./Variable');
const defLast = require('./defLast');
const Scope = require('./Scope');

class ForIO {
    constructor(id,ofIn,exp,stmt) {
        this.idExp = id;
        this.ofIn = ofIn;
        this.exp = exp;
        this.stmt = stmt;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        if(this.ofIn == 2) {
            return this.forOf(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        } else {
            return this.forIn(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        }
    }

    forOf(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        
        let id = this.idExp;
        let arrObj = this.exp.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        
        let ArraySize = arrObj.arrLen;

        let Lloop = 'L'+scope.getNewLabel()
        let lbody = 'L' + scope.getNewLabel()
        let LExit = 'L' + scope.getNewLabel()
        let tempStack = 't' + scope.getNewTemp();
        let contadorFor = 't' + scope.getNewTemp();
        let condTemp = 't' + scope.getNewTemp();
        let heapPointer = 't' + scope.getNewTemp();
        let varPointer = 't' + scope.getNewTemp();
        //console.log(this.idExp);
        let newTsObject = new tsObject(0,0,null,null);
        
        //newTsObject.code3d += entryLabel + ':\n';
        newTsObject.code3d += tempStack + '= P;\n';
        
        let asignVar;
        let prevForScope;
        if(arrObj.list.length == 0) {
            asignVar = new Variables(this.asign,id,new defLast({type:arrObj.type,list:0},this.defaultValue(arrObj.type)),null);
            prevForScope = new Scope(scope,scope.terminal,scope.label);
            asignVar = asignVar.translate(prevForScope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        } else {
            
        }
        

        //console.log(arrObj);
        //console.log("==============");
        //console.log(asignVar);
        const variableInfo = prevForScope.findVariable(id);
       // console.log(variableInfo);
        
        newTsObject.code3d += arrObj.code3d;
        newTsObject.code3d +=  asignVar.code3d;
        newTsObject.code3d += varPointer + '='+variableInfo.pointer+';\n';
        newTsObject.code3d += heapPointer + '='+arrObj.pointer+';\n';
        newTsObject.code3d += heapPointer + '= '+heapPointer+'+1;\n'
        newTsObject.code3d += contadorFor + '= 0;\n';
        newTsObject.code3d += Lloop + ':\n';
        newTsObject.code3d += 'if(' + contadorFor + ' >= '+ArraySize+')goto '+LExit+';\n';
        newTsObject.code3d += condTemp + '=2*'+contadorFor+';\n';
        newTsObject.code3d += condTemp + '='+heapPointer+'+'+condTemp+';\n';
        newTsObject.code3d += condTemp + '=Heap[(int)'+condTemp+'];\n';
        newTsObject.code3d += 'Stack[(int)'+varPointer+'] = '+condTemp+';\n';
        //newTsObject.code3d += 'goto '+LExit+';\n';
        newTsObject.code3d += lbody + ':\n';
        let newScope = new Scope(prevForScope,prevForScope.terminal,prevForScope.label);
        
        let Statement = '';
        let continueLABEL = 'L' + prevForScope.getNewLabel();
        this.stmt.forEach(element => {
            Statement += element.translate(newScope,returnlbl,LExit,continueLABEL,funcID,sCounter).code3d;
        });
        newTsObject.code3d += Statement;
        prevForScope.terminal = newScope.terminal;
        prevForScope.label = newScope.label;

        
        newTsObject.code3d += continueLABEL + ':\n';
        //let iter = this.iterate.translate(prevForScope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        
        //newTsObject.code3d += iter.code3d;
        newTsObject.code3d += contadorFor + '='+contadorFor+' + 1;\n'
        //newTsObject.code3d += 'Stack[(int)'+variableInfo.pointer+'] = '+condTemp+';\n'
        newTsObject.code3d += 'goto '+Lloop+';\n';
        newTsObject.code3d += LExit + ':\n\n';
        
        scope.terminal = prevForScope.terminal;
        scope.label = prevForScope.label;
        
        newTsObject.code3d += 'P = '+tempStack+';\n';
        
        return newTsObject;
    }

    forIn(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        
        let id = this.idExp;
        let arrObj = this.exp.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        
        let ArraySize = arrObj.arrLen;

        let Lloop = 'L'+scope.getNewLabel()
        let lbody = 'L' + scope.getNewLabel()
        let LExit = 'L' + scope.getNewLabel()
        let tempStack = 't' + scope.getNewTemp();
        //let contadorFor = 't' + scope.getNewTemp();
        let condTemp = 't' + scope.getNewTemp();
        //console.log(this.idExp);
        let newTsObject = new tsObject(0,0,null,null);
        
        //newTsObject.code3d += entryLabel + ':\n';
        newTsObject.code3d += tempStack + '= P;\n';
        let asignVar = new Variables(this.asign,id,new defLast({type:'number',list:0},new tsObject(0,0,0,'number')),null);
        let prevForScope = new Scope(scope,scope.terminal,scope.label);
        asignVar = asignVar.translate(prevForScope,returnlbl,breaklbl,continuelbl,funcID,sCounter);

        //console.log(arrObj);
        //console.log("==============");
        //console.log(asignVar);
        const variableInfo = prevForScope.findVariable(id);
       // console.log(variableInfo);
        
        newTsObject.code3d += arrObj.code3d;
        newTsObject.code3d +=  asignVar.code3d;
        newTsObject.code3d += Lloop + ':\n';
        newTsObject.code3d += condTemp + '=Stack[(int)'+variableInfo.pointer+'];\n';
        newTsObject.code3d += 'if(' + condTemp + ' < '+ArraySize+')goto '+lbody+';\n';
        newTsObject.code3d += 'goto '+LExit+';\n';
        newTsObject.code3d += lbody + ':\n';
        let newScope = new Scope(prevForScope,prevForScope.terminal,prevForScope.label);
        
        let Statement = '';
        let continueLABEL = 'L' + prevForScope.getNewLabel();
        this.stmt.forEach(element => {
            Statement += element.translate(newScope,returnlbl,LExit,continueLABEL,funcID,sCounter).code3d;
        });
        newTsObject.code3d += Statement;
        prevForScope.terminal = newScope.terminal;
        prevForScope.label = newScope.label;

        
        newTsObject.code3d += continueLABEL + ':\n';
        //let iter = this.iterate.translate(prevForScope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        
        //newTsObject.code3d += iter.code3d;
        newTsObject.code3d += condTemp + '='+condTemp+' + 1;\n'
        newTsObject.code3d += 'Stack[(int)'+variableInfo.pointer+'] = '+condTemp+';\n'
        newTsObject.code3d += 'goto '+Lloop+';\n';
        newTsObject.code3d += LExit + ':\n\n';
        
        scope.terminal = prevForScope.terminal;
        scope.label = prevForScope.label;
        
        newTsObject.code3d += 'P = '+tempStack+';\n';
        
        return newTsObject;
    }

    defaultValue(type) {
        if(type == 'number') {
            return new tsObject(0,0,0,type);
        } else if(type == 'boolean') {
            return new tsObject(0,0,0,type);
        } else if(type == 'string') {
            return new tsObject(0,0,"",type);
        }
    }
}
module.exports = ForIO;