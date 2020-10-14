class Scope {

    constructor(prev){
        this.terminal = 0;
        this.label = 0;
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