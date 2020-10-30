class Scope {

    constructor(prev){
        this.terminal = 0;
        this.label = 0;
        this.prev = prev;
        this.table = new Map();
    } 

    insertVariable(id,pointer,type,isArray,dim) {
        const newVar = {
            value:pointer,
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