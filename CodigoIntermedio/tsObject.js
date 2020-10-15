class tsObject{

    constructor(line,column,value,type) {
        this.line = line;
        this.column = column;
        this.value = value;
        this.type = type;
        this.code3d = '';
        
        //number
        if(this.type == 'number')
            this.pointer = this.value;
    }

    translate(scope) {
        return this;
    }
}

module.exports = tsObject;