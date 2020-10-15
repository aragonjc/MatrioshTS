const tsObject = require('./tsObject')

class Operation {

    constructor(nodeLeft,nodeRight,op,line,column) {
        this.nodeLeft = nodeLeft;
        this.nodeRight = nodeRight;
        this.op = op;
        this.line = line;
        this.column = column;
    }

    translate(scope) {
        switch(this.op) {
            case '+':
                return this.add(scope)
            case '-':
                return this.sub(scope)
            case '*':
                return this.mul(scope)
            case '/':
                return this.div(scope)
            case '**':
                break;
            case '%':
                return this.mod(scope)
            case '--':
                break;
        }
    }

    add(scope) {
        let newTsObject;
        const obj1 = this.nodeLeft.translate(scope)
        const obj2 = this.nodeRight.translate(scope)
        if(obj1.type == 'number' && obj2.type == 'number') {
            this.type = 'number';
        }

        if(this.type == 'string') {

        } else {
            
            newTsObject = new tsObject(0,0,null,this.type);
            newTsObject.code3d += obj1.code3d;
            newTsObject.code3d += obj2.code3d;
            let newTemp = 't' + scope.getNewTemp()
            newTsObject.pointer = newTemp;
            newTsObject.code3d += newTemp + '=' + obj1.pointer + '+' + obj2.pointer + ';\n';
            //console.log('hizo la suma');
            
        }
        return newTsObject
    }

    sub(scope) {
        let newTsObject;
        const obj1 = this.nodeLeft.translate(scope)
        const obj2 = this.nodeRight.translate(scope)
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

    mul(scope) {
        let newTsObject;
        const obj1 = this.nodeLeft.translate(scope)
        const obj2 = this.nodeRight.translate(scope)
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

    div(scope) {
        let newTsObject;
        const obj1 = this.nodeLeft.translate(scope)
        const obj2 = this.nodeRight.translate(scope)
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

    mod(scope) {
        let newTsObject;
        const obj1 = this.nodeLeft.translate(scope)
        const obj2 = this.nodeRight.translate(scope)
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
}

module.exports = Operation;