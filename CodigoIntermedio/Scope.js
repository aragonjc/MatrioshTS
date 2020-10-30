class Scope {

    constructor(prev){
        this.terminal = 0;
        this.label = 0;
        this.prev = prev;
        this.table = new Map();
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