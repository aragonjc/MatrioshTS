const tsObject = require('./tsObject');

class Logical {
    constructor(nodeLeft,nodeRight,op,line,column) {
        this.nodeLeft = nodeLeft;
        this.nodeRight = nodeRight;
        this.op = op;
        this.line = line;
        this.column = column;
    }

    translate(scope,returnlbl,breaklbl,continuelbl) {
        switch(this.op) {
            case '||':
                return this.or(scope,returnlbl,breaklbl,continuelbl)
            case '&&':
                return this.and(scope,returnlbl,breaklbl,continuelbl)
            case '!':
                return this.not(scope,returnlbl,breaklbl,continuelbl)
        }
    }

    or(scope,returnlbl,breaklbl,continuelbl) {
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl);
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl);
        let type = null;
        if(obj1 == null || obj2 == null || obj1 == undefined || obj2 == undefined) {
            console.log("ERROR");
            return;
        }      
        
        if(obj1.type == 'boolean'&& obj2.type=='boolean'){type = 'boolean';}
        else{
            console.log("ERROR tipos");
            return;
        }

        let newTSObject = new tsObject(0,0,null,type);
        newTSObject.code3d += obj1.code3d;
        newTSObject.code3d += obj2.code3d;
        let l1temp = 'L'+scope.getNewLabel()
        let l3temp = 'L'+scope.getNewLabel()
        let newTemp = 't'+scope.getNewTemp()
        newTSObject.code3d += 'if('+obj1.pointer+') goto '+l1temp+';\n';
        newTSObject.code3d += 'if('+obj2.pointer+') goto '+l1temp+';\n';
        newTSObject.code3d += newTemp + ' = 0;\n';
        newTSObject.code3d += 'goto ' + l3temp + ';\n';
        newTSObject.code3d += l1temp + ':\n';
        newTSObject.code3d += newTemp + '= 1;\n';
        newTSObject.code3d += 'goto ' + l3temp + ';\n';
        newTSObject.code3d += l3temp + ':\n\n\n';
        newTSObject.pointer = newTemp;

        return newTSObject;
    }

    and(scope,returnlbl,breaklbl,continuelbl) {
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl);
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl);
        let type = null;
        if(obj1 == null || obj2 == null || obj1 == undefined || obj2 == undefined) {
            console.log("ERROR");
            return;
        }      
        
        if(obj1.type == 'boolean'&& obj2.type=='boolean'){type = 'boolean';}
        else{
            console.log("ERROR tipos");
            return;
        }

        let newTSObject = new tsObject(0,0,null,type);
        newTSObject.code3d += obj1.code3d;
        newTSObject.code3d += obj2.code3d;
        let l1temp = 'L'+scope.getNewLabel()
        let l3temp = 'L'+scope.getNewLabel()
        let newTemp = 't'+scope.getNewTemp()
        newTSObject.code3d += 'if('+obj1.pointer+'== 0) goto '+l1temp+';\n';
        newTSObject.code3d += 'if('+obj2.pointer+'== 0) goto '+l1temp+';\n';
        newTSObject.code3d += newTemp + ' = 1;\n';
        newTSObject.code3d += 'goto ' + l3temp + ';\n';
        newTSObject.code3d += l1temp + ':\n';
        newTSObject.code3d += newTemp + '= 0;\n';
        newTSObject.code3d += 'goto ' + l3temp + ';\n';
        newTSObject.code3d += l3temp + ':\n\n\n';
        newTSObject.pointer = newTemp;
        
        return newTSObject;
    }

    not(scope,returnlbl,breaklbl,continuelbl) {

        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl);
        let type = null;
        if(obj1 == null || obj1 == undefined) {
            console.log("ERROR");
            return;
        }      
        
        if(obj1.type == 'boolean'){type = 'boolean';}
        else{
            console.log("ERROR tipos");
            return;
        }

        let newTSObject = new tsObject(0,0,null,type);
        newTSObject.code3d += obj1.code3d;
        let l1temp = 'L'+scope.getNewLabel()
        let l3temp = 'L'+scope.getNewLabel()
        let newTemp = 't'+scope.getNewTemp()
        newTSObject.code3d += 'if('+obj1.pointer+') goto '+l1temp+';\n';
        newTSObject.code3d += newTemp + ' = 1;\n';
        newTSObject.code3d += 'goto ' + l3temp + ';\n';
        newTSObject.code3d += l1temp + ':\n';
        newTSObject.code3d += newTemp + '= 0;\n';
        newTSObject.code3d += 'goto ' + l3temp + ';\n';
        newTSObject.code3d += l3temp + ':\n\n\n';
        newTSObject.pointer = newTemp;
        
        return newTSObject;
    }
}

module.exports = Logical;