const tsObject = require('./tsObject')

class Relational {
    constructor(nodeLeft,nodeRight,op,line,column) {
        this.nodeLeft = nodeLeft;
        this.nodeRight = nodeRight;
        this.op = op;
        this.line = line;
        this.column = column;
    }
    
    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        switch(this.op) {
            case '>':
                return this.greater(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            case '<':
                return this.less(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            case '>=':
                return this.greaterE(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            case '<=':
                return this.lessE(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            case '==':
                return this.equal(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            case '!=':
                return this.notEqual(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        }
    }

    greater(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        let type = null;
        if(obj1 == null || obj2 == null || obj1 == undefined || obj2 == undefined) {
            console.log("ERROR");
            return;
        }      
        
        
        if(obj1.type == 'number'&& obj2.type=='number'){type = 'boolean';}
        else if(obj1.type == 'number'&& obj2.type=='boolean'){type = 'boolean';}
        else if(obj1.type == 'boolean'&& obj2.type=='number'){type = 'boolean';}
        else if(obj1.type == 'boolean'&& obj2.type=='boolean'){type = 'boolean';}
        else{
            console.log("ERROR tipos");
            return;
        }
        

       

        let newTSObject = new tsObject(0,0,null,type);
        newTSObject.code3d += obj1.code3d;
        newTSObject.code3d += obj2.code3d;
        let newTemp = 't' + scope.getNewTemp()
        newTSObject.pointer = newTemp;
        newTSObject.code3d += newTemp + '=' + obj1.pointer + '>' + obj2.pointer + ';\n';
        
        return newTSObject;
    }

    less(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        let type = null;
        if(obj1 == null || obj2 == null || obj1 == undefined || obj2 == undefined) {
            console.log("ERROR");
            return;
        }      
        
        
        if(obj1.type == 'number'&& obj2.type=='number'){type = 'boolean';}
        else if(obj1.type == 'number'&& obj2.type=='boolean'){type = 'boolean';}
        else if(obj1.type == 'boolean'&& obj2.type=='number'){type = 'boolean';}
        else if(obj1.type == 'boolean'&& obj2.type=='boolean'){type = 'boolean';}
        else{
            console.log("ERROR tipos");
            return;
        }

        let newTSObject = new tsObject(0,0,null,type);
        newTSObject.code3d += obj1.code3d;
        newTSObject.code3d += obj2.code3d;
        let newTemp = 't' + scope.getNewTemp()
        newTSObject.pointer = newTemp;
        newTSObject.code3d += newTemp + '=' + obj1.pointer + '<' + obj2.pointer + ';\n';
        
        return newTSObject;
    }

    greaterE(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        let type = null;
        if(obj1 == null || obj2 == null || obj1 == undefined || obj2 == undefined) {
            console.log("ERROR");
            return;
        }      
        
        
        if(obj1.type == 'number'&& obj2.type=='number'){type = 'boolean';}
        else if(obj1.type == 'number'&& obj2.type=='boolean'){type = 'boolean';}
        else if(obj1.type == 'boolean'&& obj2.type=='number'){type = 'boolean';}
        else if(obj1.type == 'boolean'&& obj2.type=='boolean'){type = 'boolean';}
        else{
            console.log("ERROR tipos");
            return;
        }
        
        let newTSObject = new tsObject(0,0,null,type);
        newTSObject.code3d += obj1.code3d;
        newTSObject.code3d += obj2.code3d;
        let newTemp = 't' + scope.getNewTemp()
        newTSObject.pointer = newTemp;
        newTSObject.code3d += newTemp + '=' + obj1.pointer + '>=' + obj2.pointer + ';\n';
        
        return newTSObject;
    }

    lessE(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        let type = null;
        if(obj1 == null || obj2 == null || obj1 == undefined || obj2 == undefined) {
            console.log("ERROR");
            return;
        }      
        
        
        if(obj1.type == 'number'&& obj2.type=='number'){type = 'boolean';}
        else if(obj1.type == 'number'&& obj2.type=='boolean'){type = 'boolean';}
        else if(obj1.type == 'boolean'&& obj2.type=='number'){type = 'boolean';}
        else if(obj1.type == 'boolean'&& obj2.type=='boolean'){type = 'boolean';}
        else{
            console.log("ERROR tipos");
            return;
        }
        
        let newTSObject = new tsObject(0,0,null,type);
        newTSObject.code3d += obj1.code3d;
        newTSObject.code3d += obj2.code3d;
        let newTemp = 't' + scope.getNewTemp()
        newTSObject.pointer = newTemp;
        newTSObject.code3d += newTemp + '=' + obj1.pointer + '<=' + obj2.pointer + ';\n';
        
        return newTSObject;
    }

    equal(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {

        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        let type = null;
        let kind = null;
        if(obj1 == null || obj2 == null || obj1 == undefined || obj2 == undefined) {
            console.log("ERROR");
            return;
        }      
        
        if(obj1.type == 'number'&& obj2.type == 'number'){type = 'boolean';}
        else if(obj1.type == 'number'&& obj2.type == 'boolean'){type = 'boolean';}
        else if(obj1.type == 'boolean'&& obj2.type == 'number'){type = 'boolean';}
        else if(obj1.type == 'boolean'&& obj2.type == 'boolean'){type = 'boolean';}
        else if(obj1.type == 'string' && obj2.type == 'string') {
            type = 'boolean';
            kind = 'string';

            let newTsObject = new tsObject(0,0,null,type);

            let stringPointer = 't'+scope.getNewTemp();
            let stringPointer2 = 't'+scope.getNewTemp();
            
            //this.code3d += 
            let stringLabel = 'L'+scope.getNewLabel();
            let falseLabel = 'L' + scope.getNewLabel();
            let trueLabel = 'L' + scope.getNewLabel();
            let endStringLabel = 'L' + scope.getNewLabel();
            let exitLabel = 'L'+scope.getNewLabel();
            
            let temp = 't'+scope.getNewTemp();
            let temp2 = 't'+scope.getNewTemp();

            let newPointer = 't' + scope.getNewTemp();

            newTsObject.code3d += obj1.code3d;
            newTsObject.code3d += obj2.code3d;
            newTsObject.code3d += stringPointer + '=' + obj1.pointer+';\n';
            newTsObject.code3d += stringPointer2 + '=' + obj2.pointer+';\n';
            newTsObject.code3d+= stringLabel +':\n';
            newTsObject.code3d+=temp + '=Heap[(int)'+stringPointer+'];\n';
            newTsObject.code3d+=temp2 + '=Heap[(int)'+stringPointer2+'];\n';
            newTsObject.code3d+='if('+temp + '==' +'\0'.charCodeAt(0) + ') goto ' + endStringLabel + ';\n';
            newTsObject.code3d+= 'if('+temp+'!='+temp2+') goto '+falseLabel+';\n';
            newTsObject.code3d+= stringPointer + '= '+stringPointer+' +1;\n';
            newTsObject.code3d+= stringPointer2 + '= '+stringPointer2+' +1;\n';
            newTsObject.code3d+= 'goto '+stringLabel+';\n';

            newTsObject.code3d+=endStringLabel+':\n';
            newTsObject.code3d+='if('+temp2 + '==' +'\0'.charCodeAt(0) + ') goto ' + trueLabel + ';\n';

            newTsObject.code3d+=falseLabel+':\n';
            newTsObject.code3d+=newPointer + '=0;\n';
            newTsObject.code3d+= 'goto '+exitLabel+';\n';

            newTsObject.code3d+=trueLabel+':\n';
            newTsObject.code3d+=newPointer + '=1;\n';
            newTsObject.code3d+= 'goto '+exitLabel+';\n';

            newTsObject.code3d+=exitLabel+':\n\n';
            newTsObject.pointer = newPointer;
            return newTsObject;

        } else if(obj1.type == 'string' && obj2.type == 'null') {
            type = 'boolean'
            if(obj1.isArray) {

            } else {

                let newTSObject = new tsObject(0,0,null,type);
                newTSObject.code3d += obj1.code3d;
                newTSObject.code3d += obj2.code3d;
                let newTemp = 't' + scope.getNewTemp()
                let stringPointer = 't' + scope.getNewTemp();
                let lbl1 = 'L' + scope.getNewLabel()
                let lbl2 = 'L' + scope.getNewLabel()
                newTSObject.code3d += stringPointer + '=Heap[(int)'+obj1.pointer+'];\n';
                newTSObject.code3d += 'if(' + stringPointer + '==' + obj2.pointer+') goto '+lbl1+';\n'
                newTSObject.code3d += newTemp + '=0;\n';
                newTSObject.code3d += 'goto '+lbl2+';\n';
                newTSObject.code3d += lbl1 +':\n';
                newTSObject.code3d += newTemp + '=1;\n';
                newTSObject.code3d += 'goto '+lbl2+';\n';
                newTSObject.code3d += lbl2 +':\n\n\n';
                newTSObject.pointer = newTemp;
                
                return newTSObject;
            }

        } else if(obj1.type == 'null' && obj2.type == 'string') {

        } 
        //FALTA NULL Y FALTA ALGUNAS COMPROBACIONES CON CADENAS

        else{
            console.log("ERROR tipos");
            return;
        }

        //console.log(obj2)

        let newTSObject = new tsObject(0,0,null,type);
        newTSObject.code3d += obj1.code3d;
        newTSObject.code3d += obj2.code3d;
        let newTemp = 't' + scope.getNewTemp()
        let lbl1 = 'L' + scope.getNewLabel()
        let lbl2 = 'L' + scope.getNewLabel()
        newTSObject.code3d += 'if(' + obj1.pointer + '==' + obj2.pointer+') goto '+lbl1+';\n'
        newTSObject.code3d += newTemp + '=0;\n';
        newTSObject.code3d += 'goto '+lbl2+';\n';
        newTSObject.code3d += lbl1 +':\n';
        newTSObject.code3d += newTemp + '=1;\n';
        newTSObject.code3d += 'goto '+lbl2+';\n';
        newTSObject.code3d += lbl2 +':\n\n\n';
        newTSObject.pointer = newTemp;

        return newTSObject;
    }

    notEqual(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        let type = null;
        let kind = null;
        if(obj1 == null || obj2 == null || obj1 == undefined || obj2 == undefined) {
            console.log("ERROR");
            return;
        }      
        
        if(obj1.type == 'number'&& obj2.type == 'number'){type = 'boolean';}
        else if(obj1.type == 'number'&& obj2.type == 'boolean'){type = 'boolean';}
        else if(obj1.type == 'boolean'&& obj2.type == 'number'){type = 'boolean';}
        else if(obj1.type == 'boolean'&& obj2.type == 'boolean'){type = 'boolean';}
        else if(obj1.type == 'string' && obj2.type == 'string') {
            type = 'boolean';
            kind = 'string';

            let newTsObject = new tsObject(0,0,null,type);

            let stringPointer = 't'+scope.getNewTemp();
            let stringPointer2 = 't'+scope.getNewTemp();
            
            //this.code3d += 
            let stringLabel = 'L'+scope.getNewLabel();
            let falseLabel = 'L' + scope.getNewLabel();
            let trueLabel = 'L' + scope.getNewLabel();
            let endStringLabel = 'L' + scope.getNewLabel();
            let exitLabel = 'L'+scope.getNewLabel();
            
            let temp = 't'+scope.getNewTemp();
            let temp2 = 't'+scope.getNewTemp();

            let newPointer = 't' + scope.getNewTemp();

            newTsObject.code3d += obj1.code3d;
            newTsObject.code3d += obj2.code3d;
            newTsObject.code3d += stringPointer + '=' + obj1.pointer+';\n';
            newTsObject.code3d += stringPointer2 + '=' + obj2.pointer+';\n';
            newTsObject.code3d+= stringLabel +':\n';
            newTsObject.code3d+=temp + '=Heap[(int)'+stringPointer+'];\n';
            newTsObject.code3d+=temp2 + '=Heap[(int)'+stringPointer2+'];\n';
            newTsObject.code3d+='if('+temp + '==' +'\0'.charCodeAt(0) + ') goto ' + endStringLabel + ';\n';
            newTsObject.code3d+= 'if('+temp+'=='+temp2+') goto '+falseLabel+';\n';
            newTsObject.code3d+= stringPointer + '= '+stringPointer+' +1;\n';
            newTsObject.code3d+= stringPointer2 + '= '+stringPointer2+' +1;\n';
            newTsObject.code3d+= 'goto '+stringLabel+';\n';

            newTsObject.code3d+=endStringLabel+':\n';
            newTsObject.code3d+='if('+temp2 + '==' +'\0'.charCodeAt(0) + ') goto ' + trueLabel + ';\n';

            newTsObject.code3d+=falseLabel+':\n';
            newTsObject.code3d+=newPointer + '=0;\n';
            newTsObject.code3d+= 'goto '+exitLabel+';\n';

            newTsObject.code3d+=trueLabel+':\n';
            newTsObject.code3d+=newPointer + '=1;\n';
            newTsObject.code3d+= 'goto '+exitLabel+';\n';

            newTsObject.code3d+=exitLabel+':\n\n';
            newTsObject.pointer = newPointer;
            return newTsObject;

        }
        //FALTA NULL Y FALTA ALGUNAS COMPROBACIONES CON CADENAS

        else{
            console.log("ERROR tipos");
            return;
        }

        if(kind == 'string') {

        }

        //console.log(obj2)

        let newTSObject = new tsObject(0,0,null,type);
        newTSObject.code3d += obj1.code3d;
        newTSObject.code3d += obj2.code3d;
        let newTemp = 't' + scope.getNewTemp()
        let lbl1 = 'L' + scope.getNewLabel()
        let lbl2 = 'L' + scope.getNewLabel()
        newTSObject.code3d += 'if(' + obj1.pointer + '==' + obj2.pointer+') goto '+lbl1+';\n'
        newTSObject.code3d += newTemp + '=1;\n';
        newTSObject.code3d += 'goto '+lbl2+';\n';
        newTSObject.code3d += lbl1 +':\n';
        newTSObject.code3d += newTemp + '=0;\n';
        newTSObject.code3d += 'goto '+lbl2+';\n';
        newTSObject.code3d += lbl2 +':\n\n\n';
        newTSObject.pointer = newTemp;
        return newTSObject;
    }
}
module.exports = Relational;