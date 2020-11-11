const tsObject = require('./tsObject')

class Relational {
    constructor(nodeLeft,nodeRight,op,line,column) {
        this.nodeLeft = nodeLeft;
        this.nodeRight = nodeRight;
        this.op = op;
        this.line = line;
        this.column = column;
    }
    
    translate(scope,returnlbl,breaklbl,continuelbl,funcID) {
        switch(this.op) {
            case '>':
                return this.greater(scope,returnlbl,breaklbl,continuelbl,funcID)
            case '<':
                return this.less(scope,returnlbl,breaklbl,continuelbl,funcID)
            case '>=':
                return this.greaterE(scope,returnlbl,breaklbl,continuelbl,funcID)
            case '<=':
                return this.lessE(scope,returnlbl,breaklbl,continuelbl,funcID)
            case '==':
                return this.equal(scope,returnlbl,breaklbl,continuelbl,funcID)
            case '!=':
                return this.notEqual(scope,returnlbl,breaklbl,continuelbl,funcID)
        }
    }

    greater(scope,returnlbl,breaklbl,continuelbl) {
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID);
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID);
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

    less(scope,returnlbl,breaklbl,continuelbl) {
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID);
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID);
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

    greaterE(scope,returnlbl,breaklbl,continuelbl) {
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID);
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID);
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

    lessE(scope,returnlbl,breaklbl,continuelbl) {
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID);
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID);
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

    equal(scope,returnlbl,breaklbl,continuelbl,funcID) {

        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID);
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID);
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
            type = 'boolean'
            kind = 'string'
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
        newTSObject.code3d += newTemp + '=0;\n';
        newTSObject.code3d += 'goto '+lbl2+';\n';
        newTSObject.code3d += lbl1 +':\n';
        newTSObject.code3d += newTemp + '=1;\n';
        newTSObject.code3d += 'goto '+lbl2+';\n';
        newTSObject.code3d += lbl2 +':\n\n\n';
        newTSObject.pointer = newTemp;
        return newTSObject;
    }

    notEqual(scope,returnlbl,breaklbl,continuelbl) {
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID);
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID);
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
            type = 'boolean'
            kind = 'string'
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