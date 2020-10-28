const tsObject = require('./tsObject')

class Relational {
    constructor(nodeLeft,nodeRight,op,line,column) {
        this.nodeLeft = nodeLeft;
        this.nodeRight = nodeRight;
        this.op = op;
        this.line = line;
        this.column = column;
    }
    
    translate(scope) {
        switch(this.op) {
            case '>':
                return this.greater(scope)
            case '<':
                break;
                //return this.less(scope)
            case '>=':
                break;
                //return this.greaterE(scope)
            case '<=':
                break
                //return this.lessE(scope)
            case '==':
                break
                //return this.equal(scope)
            case '!=':
                break
                //return this.notEqual(scope)
        }
    }

    greater(scope) {
        const obj1 = this.nodeLeft.translate(scope);
        const obj2 = this.nodeRight.translate(scope);
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
}
module.exports = Relational;