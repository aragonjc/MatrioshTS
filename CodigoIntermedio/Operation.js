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
                break;
            case '*':
                break;
            case '/':

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
            
            

        }
    }

}

module.exports = Operation;