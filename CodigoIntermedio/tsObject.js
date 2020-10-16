class tsObject{

    constructor(line,column,value,type) {
        this.line = line;
        this.column = column;
        this.value = value;
        this.type = type;
        this.code3d = '';
        
        //number
        if(this.type == 'number' || this.type == 'boolean')
            this.pointer = this.value;
    }

    
    translate(scope) {

        if(this.type == 'string') {
            let string = this.value.substring(1,this.value.length-1);
            let newTemp = 't' + scope.getNewTemp();
            let newTempCounter = 't' + scope.getNewTemp();
            this.pointer = newTemp;
            this.code3d += newTemp + '=H;\n';
            this.code3d += newTempCounter + '=H;\n';
            for(let i =0;i<string.length;i++) {
                this.code3d += 'Heap[(int)' + newTempCounter + '] = ' + string.charCodeAt(i) + ';\n'
                this.code3d += newTempCounter + '=' + newTempCounter + '+1;\n'
            }
            this.code3d += 'Heap[(int)'+newTempCounter+']='+'\0'.charCodeAt(0)+';\n';
            this.code3d += newTempCounter + '='+newTempCounter + '+1;\n';
            this.code3d += 'H=' + newTempCounter +';\n';
            this.value = undefined;

        }

        return this;
    }
}

module.exports = tsObject;