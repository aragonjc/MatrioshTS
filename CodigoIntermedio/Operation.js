const tsObject = require('./tsObject')

class Operation {

    constructor(nodeLeft,nodeRight,op,line,column) {
        this.nodeLeft = nodeLeft;
        this.nodeRight = nodeRight;
        this.op = op;
        this.line = line;
        this.column = column;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        switch(this.op) {
            case '+':
                return this.add(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            case '-':
                return this.sub(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            case '*':
                return this.mul(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            case '/':
                return this.div(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            case '**':
                return this.pow(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            case '%':
                return this.mod(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            case '--':
                return this.neg(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        }
    }

    add(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        let newTsObject;
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        
        if(obj1.type == 'number' && obj2.type == 'number') {
            this.type = 'number';
        } else if (obj1.type == 'string' && obj2.type == 'string') {
            
            this.type = 'string'

        } else if (obj1.type == 'string' && obj2.type == 'number') {
            
            this.type = 'string'
            let actualPointer = 't' + scope.getNewTemp();
            let stringPos = 't' + scope.getNewTemp();
            obj2.code3d += actualPointer + '=H;\n';
            obj2.code3d += stringPos + '=H;\n';
            obj2.code3d += 'Heap[(int)' + stringPos + '] = -1;\n';
            obj2.code3d += stringPos + '=' + stringPos + '+1;\n';
            obj2.code3d += 'Heap[(int)' + stringPos + '] = ' + obj2.pointer + ';\n';
            obj2.code3d += stringPos + '=' + stringPos + '+1;\n';
            obj2.code3d += 'Heap[(int)' + stringPos + '] = ' + '\0'.charCodeAt(0)+ ';\n';
            obj2.code3d += stringPos + '=' + stringPos + '+1;\n';
            obj2.code3d += 'H=' + stringPos + ';\n';
            obj2.pointer = actualPointer;

        } else if (obj1.type == 'string' && obj2.type == 'boolean') {
            
            this.type = 'string'
            let actualPointer = 't' + scope.getNewTemp();
            let boolPos = 't' + scope.getNewTemp();
            obj2.code3d += actualPointer + '=H;\n';
            obj2.code3d += boolPos + '=H;\n';
            
            let falseLabel = 'L' + scope.getNewLabel();
            let trueLabel = 'L' + scope.getNewLabel();
            let exitLabel = 'L' + scope.getNewLabel();

            //obj2.code3d += 'Heap[(int)' + boolPos + '] = -3;\n';
            //obj2.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj2.code3d += 'if(' + obj2.pointer + '== 0) goto '+falseLabel+';\n';
            obj2.code3d += 'goto ' + trueLabel +';\n';
            obj2.code3d += falseLabel + ':\n';
            obj2.code3d += 'Heap[(int)'+boolPos+']='+'f'.charCodeAt(0)+';\n'
            obj2.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj2.code3d += 'Heap[(int)'+boolPos+']='+'a'.charCodeAt(0)+';\n'
            obj2.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj2.code3d += 'Heap[(int)'+boolPos+']='+'l'.charCodeAt(0)+';\n'
            obj2.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj2.code3d += 'Heap[(int)'+boolPos+']='+'s'.charCodeAt(0)+';\n'
            obj2.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj2.code3d += 'Heap[(int)'+boolPos+']='+'e'.charCodeAt(0)+';\n'
            obj2.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj2.code3d += 'Heap[(int)'+boolPos+']='+'\0'.charCodeAt(0)+';\n'
            obj2.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj2.code3d += 'goto ' +exitLabel + ';\n';
            
            obj2.code3d += trueLabel + ':\n';
            obj2.code3d += 'Heap[(int)'+boolPos+']='+'t'.charCodeAt(0)+';\n'
            obj2.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj2.code3d += 'Heap[(int)'+boolPos+']='+'r'.charCodeAt(0)+';\n'
            obj2.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj2.code3d += 'Heap[(int)'+boolPos+']='+'u'.charCodeAt(0)+';\n'
            obj2.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj2.code3d += 'Heap[(int)'+boolPos+']='+'e'.charCodeAt(0)+';\n'
            obj2.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj2.code3d += 'Heap[(int)'+boolPos+']='+'\0'.charCodeAt(0)+';\n'
            obj2.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj2.code3d += 'goto ' +exitLabel + ';\n';
            obj2.code3d += exitLabel + ':\n\n';

            obj2.code3d += 'H=' + boolPos + ';\n';
            obj2.pointer = actualPointer;

        } else if (obj1.type == 'number' && obj2.type == 'string') {
            
            this.type = 'string'
            let actualPointer = 't' + scope.getNewTemp();
            let stringPos = 't' + scope.getNewTemp();
            obj1.code3d += actualPointer + '=H;\n';
            obj1.code3d += stringPos + '=H;\n';

            obj1.code3d += 'Heap[(int)' + stringPos + '] = -1;\n';
            obj1.code3d += stringPos + '=' + stringPos + '+1;\n';
            obj1.code3d += 'Heap[(int)' + stringPos + '] = ' + obj1.pointer + ';\n';
            obj1.code3d += stringPos + '=' + stringPos + '+1;\n';
            obj1.code3d += 'Heap[(int)' + stringPos + '] = ' + '\0'.charCodeAt(0)+ ';\n';
            obj1.code3d += stringPos + '=' + stringPos + '+1;\n';
            obj1.code3d += 'H=' + stringPos + ';\n';
            obj1.pointer = actualPointer;
        
        } else if (obj1.type == 'boolean' && obj2.type == 'string') {
            
            this.type = 'string'
            
            let actualPointer = 't' + scope.getNewTemp();
            let boolPos = 't' + scope.getNewTemp();
            obj1.code3d += actualPointer + '=H;\n';
            obj1.code3d += boolPos + '=H;\n';
            
            let falseLabel = 'L' + scope.getNewLabel();
            let trueLabel = 'L' + scope.getNewLabel();
            let exitLabel = 'L' + scope.getNewLabel();

            //obj1.code3d += 'Heap[(int)' + boolPos + '] = -3;\n';
            //obj1.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj1.code3d += 'if(' + obj1.pointer + '== 0) goto '+falseLabel+';\n';
            obj1.code3d += 'goto ' + trueLabel +';\n';
            obj1.code3d += falseLabel + ':\n';
            obj1.code3d += 'Heap[(int)'+boolPos+']='+'f'.charCodeAt(0)+';\n'
            obj1.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj1.code3d += 'Heap[(int)'+boolPos+']='+'a'.charCodeAt(0)+';\n'
            obj1.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj1.code3d += 'Heap[(int)'+boolPos+']='+'l'.charCodeAt(0)+';\n'
            obj1.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj1.code3d += 'Heap[(int)'+boolPos+']='+'s'.charCodeAt(0)+';\n'
            obj1.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj1.code3d += 'Heap[(int)'+boolPos+']='+'e'.charCodeAt(0)+';\n'
            obj1.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj1.code3d += 'Heap[(int)'+boolPos+']='+'\0'.charCodeAt(0)+';\n'
            obj1.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj1.code3d += 'goto ' +exitLabel + ';\n';
            
            obj1.code3d += trueLabel + ':\n';
            obj1.code3d += 'Heap[(int)'+boolPos+']='+'t'.charCodeAt(0)+';\n'
            obj1.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj1.code3d += 'Heap[(int)'+boolPos+']='+'r'.charCodeAt(0)+';\n'
            obj1.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj1.code3d += 'Heap[(int)'+boolPos+']='+'u'.charCodeAt(0)+';\n'
            obj1.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj1.code3d += 'Heap[(int)'+boolPos+']='+'e'.charCodeAt(0)+';\n'
            obj1.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj1.code3d += 'Heap[(int)'+boolPos+']='+'\0'.charCodeAt(0)+';\n'
            obj1.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj1.code3d += 'goto ' +exitLabel + ';\n';
            obj1.code3d += exitLabel + ':\n\n';

            obj1.code3d += 'H=' + boolPos + ';\n';
            obj1.pointer = actualPointer;


        } else {
            console.log("ERROR")
            return;
        }

        if(this.type == 'string') {

            newTsObject = new tsObject(0,0,null,this.type);
            newTsObject.code3d += obj1.code3d;
            newTsObject.code3d += obj2.code3d;
            
            let actualPointer = 't'+scope.getNewTemp();
            let newActualPointer = 't' + scope.getNewTemp();
            let temp = 't' + scope.getNewTemp();
            let auxTemp = 't'+scope.getNewTemp();
            let stringPos1 = 't' + scope.getNewTemp();
            let stringPos2 = 't' + scope.getNewTemp();
            let leftString = 'L' + scope.getNewLabel();
            let exitLeftString = 'L' + scope.getNewLabel();
            let rigthString = 'L' + scope.getNewLabel();
            let exitRigthString = 'L' + scope.getNewLabel();
            let exitLabel = 'L' + scope.getNewLabel();

            newTsObject.code3d += actualPointer + '=H;\n';
            newTsObject.code3d += newActualPointer + '=H;\n';
            newTsObject.code3d += stringPos1 + '=' + obj1.pointer + ';\n';
            //newObject.code3d += 'Aqui pongo el apuntador 1\n';
            newTsObject.code3d += stringPos2 + '=' + obj2.pointer + ';\n';
            //newObject.code3d += 'Aqui pongo el apuntador 2\n';

            newTsObject.code3d += leftString + ':\n';
            newTsObject.code3d += temp + '= Heap[(int)' + stringPos1 + '];\n';
            newTsObject.code3d += 'if('+ temp +' == ' + '\0'.charCodeAt(0) + ') goto ' + exitLeftString +';\n';
            newTsObject.code3d += 'Heap[(int)' + newActualPointer + '] = ' + temp + ';\n';
            newTsObject.code3d += newActualPointer + '=' + newActualPointer + '+1;\n';
            newTsObject.code3d += stringPos1 + '=' + stringPos1 + '+1;\n';
            //newObject.code3d += temp + '= Heap[' + newActualPointer + '];\n';
            newTsObject.code3d += 'goto ' + leftString + ';\n';
            newTsObject.code3d += exitLeftString + ':\n\n';
            
            newTsObject.code3d += rigthString + ':\n';
            newTsObject.code3d += temp + ' = Heap[(int)' + stringPos2 + '];\n';
            newTsObject.code3d += 'if('+ temp + ' == ' + '\0'.charCodeAt(0) + ') goto ' + exitLabel +';\n';
            newTsObject.code3d += 'Heap[(int)' + newActualPointer + '] = ' + temp + ';\n';
            newTsObject.code3d += newActualPointer + '=' + newActualPointer + '+1;\n';
            newTsObject.code3d += stringPos2 + '=' + stringPos2 + '+1;\n';
            newTsObject.code3d += 'goto ' + rigthString + ';\n';
            newTsObject.code3d += exitLabel + ':\n';
            newTsObject.code3d += 'Heap[(int)' + newActualPointer +'] = ' + '\0'.charCodeAt(0) + ';\n';
            newTsObject.code3d += newActualPointer + '=' + newActualPointer + '+ 1;\n';
            newTsObject.code3d += 'H = ' + newActualPointer + ';\n\n';
            newTsObject.pointer = actualPointer;
            
            
        } else {
            newTsObject = new tsObject(0,0,null,this.type);
            newTsObject.code3d += obj1.code3d;
            newTsObject.code3d += obj2.code3d;
            let newTemp = 't' + scope.getNewTemp()
            newTsObject.pointer = newTemp;
            newTsObject.code3d += newTemp + '=' + obj1.pointer + '+' + obj2.pointer + ';\n';
        }
        return newTsObject
    }

    sub(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        let newTsObject;
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        if(obj1.type == 'number' && obj2.type == 'number') {
            this.type = 'number';
        } else {
            console.log("ERROR")
            return null;
        }

        newTsObject = new tsObject(0,0,null,this.type);
        newTsObject.code3d += obj1.code3d;
        newTsObject.code3d += obj2.code3d;
        let newTemp = 't' + scope.getNewTemp()
        newTsObject.pointer = newTemp;
        newTsObject.code3d += newTemp + '=' + obj1.pointer + '-' + obj2.pointer + ';\n';
        
        return newTsObject;
    }

    mul(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        let newTsObject;
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        if(obj1.type == 'number' && obj2.type == 'number') {
            this.type = 'number';
        } else {
            console.log("ERROR")
            return null;
        }

        newTsObject = new tsObject(0,0,null,this.type);
        newTsObject.code3d += obj1.code3d;
        newTsObject.code3d += obj2.code3d;
        let newTemp = 't' + scope.getNewTemp()
        newTsObject.pointer = newTemp;
        newTsObject.code3d += newTemp + '=' + obj1.pointer + '*' + obj2.pointer + ';\n';
        
        return newTsObject;
    }

    div(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        let newTsObject;
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        if(obj1.type == 'number' && obj2.type == 'number') {
            this.type = 'number';
        } else {
            console.log("ERROR")
            return null;
        }

        newTsObject = new tsObject(0,0,null,this.type);
        newTsObject.code3d += obj1.code3d;
        newTsObject.code3d += obj2.code3d;
        let newTemp = 't' + scope.getNewTemp()
        newTsObject.pointer = newTemp;
        newTsObject.code3d += newTemp + '=' + obj1.pointer + '/' + obj2.pointer + ';\n';
        
        return newTsObject;
    }

    mod(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        let newTsObject;
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        if(obj1.type == 'number' && obj2.type == 'number') {
            this.type = 'number';
        } else {
            console.log("ERROR")
            return null;
        }

        newTsObject = new tsObject(0,0,null,this.type);
        newTsObject.code3d += obj1.code3d;
        newTsObject.code3d += obj2.code3d;
        let newTemp = 't' + scope.getNewTemp()
        newTsObject.pointer = newTemp;
        newTsObject.code3d += newTemp + '=' + obj1.pointer + '%' + obj2.pointer + ';\n';
        
        return newTsObject;
    }

    neg(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        let newTsObject;
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        if(obj1.type == 'number') {
            this.type = 'number';
        } else {
            console.log("ERROR")
            return null;
        }

        newTsObject = new tsObject(0,0,null,this.type);
        newTsObject.code3d += obj1.code3d;
        let newTemp = 't' + scope.getNewTemp()
        newTsObject.pointer = newTemp;
        newTsObject.code3d += newTemp + '= -' + obj1.pointer + ';\n';
        
        return newTsObject;
    }

    pow(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        let newTsObject;
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        if(obj1.type == 'number' && obj2.type == 'number') {
            this.type = 'number';
        } else {
            console.log("ERROR")
            return null;
        }

        newTsObject = new tsObject(0,0,null,this.type);
        newTsObject.code3d+=obj1.code3d;
        newTsObject.code3d+=obj2.code3d;


        let newTemp = 't'+scope.getNewTemp();
        let ceroLabel = 'L' + scope.getNewLabel();
        let initLabel = 'L' + scope.getNewLabel();
        let powLabel = 'L'  + scope.getNewLabel();
        newTsObject.pointer = newTemp;
        

        newTsObject.code3d += newTemp + '=' + '1' + ';\n';
        
        let tempCounter = 't'+scope.getNewTemp();
        newTsObject.code3d += tempCounter + '= 0;\n';
        let exp = 't'+scope.getNewTemp();
        newTsObject.code3d += exp + '='+ obj2.pointer + '-1;\n'
        
        newTsObject.code3d += 'if(' + obj2.pointer + ' == 0) goto ' + ceroLabel + ';\n';
        newTsObject.code3d += newTemp + '='+ obj1.pointer + ';\n';
        newTsObject.code3d += 'if(' + obj2.pointer + ' > 0) goto ' + powLabel + ';\n';

        newTsObject.code3d += powLabel + ':\n';
        newTsObject.code3d += newTemp + '=' + newTemp + '*' + obj1.pointer + ';\n';
        newTsObject.code3d += tempCounter + '=' + tempCounter + '+1;\n';
        newTsObject.code3d += initLabel + ':\n'; 
        newTsObject.code3d += 'if(' + tempCounter + '==' + exp + ') goto ' + ceroLabel +';\n';
        newTsObject.code3d += 'goto '+powLabel + ';\n'; 
        newTsObject.code3d += ceroLabel + ':\n\n';
        
        

        return newTsObject;
    }
}

module.exports = Operation;