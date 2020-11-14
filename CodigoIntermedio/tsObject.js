class tsObject{

    constructor(line,column,value,type) {
        this.line = line;
        this.column = column;
        this.value = value;
        this.type = type;
        this.code3d = '';
        this.isArray = false;
        this.isType = false;
        this.dim = [];
        this.arrFinal = 0;
        this.list = [];
        this.arrLen = 0;
        this.isNull = false;
        
        if(this.type == 'null')
            this.isNull == true;
        //number
        if(this.type == 'number' || this.type == 'boolean' || this.type == 'null')
            this.pointer = this.value;
    }

    
    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {

        if(this.type == 'string') {
            if(this.value != null) {

            
                let string = this.value.substring(1,this.value.length-1);
            
            //if(string.length == 2) {
                
                /*if(string == '\\n') {

                    
                    let newTemp = 't' + scope.getNewTemp();
                    let newTempCounter = 't' + scope.getNewTemp();
                    this.pointer = newTemp;
                    this.code3d += newTemp + '=H;\n';
                    this.code3d += newTempCounter + '=H;\n';
                    
                        this.code3d += 'Heap[(int)' + newTempCounter + '] = 10;\n'
                        this.code3d += newTempCounter + '=' + newTempCounter + '+1;\n'
                    
                    this.code3d += 'Heap[(int)'+newTempCounter+']='+'\0'.charCodeAt(0)+';\n';
                    this.code3d += newTempCounter + '='+newTempCounter + '+1;\n';
                    this.code3d += 'H=' + newTempCounter +';\n';
                    this.value = undefined;

                    return this;
                }*/
            //}
                
                //string = string.replace("\n","\\n")
                
                let newTemp = 't' + scope.getNewTemp();
                let newTempCounter = 't' + scope.getNewTemp();
                this.pointer = newTemp;
                
                this.code3d += '\n//////////////////////////////////\n';

                this.code3d += newTemp + '=H;\n';
                this.code3d += newTempCounter + '=H;\n';

                for(let i =0;i<string.length;i++) {

                    if(string[i] == "\\" && i<string.length-1) {
                        if(string[i+1]=='n') {
                            this.code3d += 'Heap[(int)' + newTempCounter + '] = 10;\n'
                            this.code3d += newTempCounter + '=' + newTempCounter + '+1;\n'
                            i++;
                        } else {
                            this.code3d += 'Heap[(int)' + newTempCounter + '] = ' + string.charCodeAt(i) + ';\n'
                            this.code3d += newTempCounter + '=' + newTempCounter + '+1;\n'
                        }
                    } else {
                        this.code3d += 'Heap[(int)' + newTempCounter + '] = ' + string.charCodeAt(i) + ';\n'
                        this.code3d += newTempCounter + '=' + newTempCounter + '+1;\n'
                    }
                }
                this.code3d += 'Heap[(int)'+newTempCounter+']='+'\0'.charCodeAt(0)+';\n';
                this.code3d += newTempCounter + '='+newTempCounter + '+1;\n';
                this.code3d += 'H=' + newTempCounter +';\n';
                this.value = undefined;
                this.code3d += '\n//////////////////////////////////\n';
            }
        }

        return this;
    }
}

module.exports = tsObject;