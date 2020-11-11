class Scope {

    constructor(prev,terminal,label){
        this.terminal = terminal;
        this.label = label;
        this.prev = prev;
        this.table = new Map();
        this.funcTable = new Map();
        this.prevSize = 0;
        this.isFuncScope = null;
        this.tempList = [];
        if(prev != null) {
            this.prevSize = prev.table.size;
        }
        
    }

    getSize() {
        return this.table.size
    }

    findVariable(id) {
        var sc= null;

        for(sc = this;sc != null;sc = sc.prev){
            if(sc.table.has(id)) {
                return sc.table.get(id);
            }
        }
        return null;
    }

    getFunctionParameters() {
        let parameters = [];

        var sc= null;

        for(sc = this;sc != null;sc = sc.prev){

            if(sc.isFuncScope) {

                for (let [key, value] of sc.table) {
                    parameters.push(value.pointer);
                }

                return parameters;
            } 
        }

        return parameters;
    }

    getVariablesInFunc() {
        let variables = [];

        var sc= null;

        for(sc = this;sc != null;sc = sc.prev){

            if(sc.isFuncScope) {

                sc.tempList.forEach(val => {
                    variables.push(val);
                });

                /*for (let [key, value] of sc.table) {
                    variables.push(value.pointer);
                }*/

                break;
            } else {
                sc.tempList.forEach(val => {
                    variables.push(val);
                });
            }
        }

        return variables;
    }

    modifyVariable(id,value) {
        var sc= null;

        for(sc = this;sc != null;sc = sc.prev){
            if(sc.table.has(id)) {
                sc.table.set(id,value);
            }
        }
    }

    insertVariable(id,pointer,type,isArray,dim) {
        const newVar = {
            pointer:pointer,
            type:type
        }

        if(!this.existsLocalVariable(id)) {
            this.table.set(id,newVar);
            return true;
        } 
        console.log("ERROR la variable " + id + " ya existe")
        return false;
    }

    existsFunction(id) {
        var sc= null;

        for(sc = this;sc != null;sc = sc.prev){
            if(sc.funcTable.has(id)) {
                return sc.funcTable.get(id);
            }
        }
        return null;
    }
    
    insertFunction(id,type,dim,paramsList,returnTemp) {
        const newVar = {
            type:type,
            dim:dim,
            paramsList:paramsList,
            returnTemp:returnTemp,
            returnValue:-1
        }

        if(!this.existsFunction(id)) {
            this.funcTable.set(id,newVar);
            return true;
        } 
        console.log("ERROR la variable " + id + " ya existe")
        return false;
    }

    changeFunction(id,value) {
        var sc= null;

        for(sc = this;sc != null;sc = sc.prev){
            if(sc.funcTable.has(id)) {
                sc.funcTable.set(id,value);
            }
        }
    }

    existsLocalVariable(id){
        return this.table.has(id);
    }

    getNewTemp() {
        this.terminal++;
        return this.terminal;
    }

    getNewLabel() {
        this.label++;
        return this.label;
    }
}

module.exports = Scope;