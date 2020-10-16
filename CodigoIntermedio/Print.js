
class Print {

    constructor(value,line){
        this.pointer = null;
        this.type = null;
        this.value = value;
        this.line = line;
        this.code3d = '';
        this.dataType = 'print';
    }

    translate(scope) {
            
        let printValue = this.value.translate(scope);
        
        this.code3d = '';
        
        if(printValue === null || printValue === undefined) {
            //add to errors table
            console.log('ERROR')
            
            return;
        }

        this.code3d += printValue.code3d;
        if(printValue.type == 'number') {
            this.code3d += 'printf("%f",' + printValue.pointer + ');\n';
        } else if(printValue.type === 'string') {

            let stringPointer = 't'+scope.getNewTemp();
            this.code3d += stringPointer + '=' + printValue.pointer+';\n';
            let stringLabel = 'L'+scope.getNewLabel();
            let integerLabel = 'L' + scope.getNewLabel();
            let doubleLabel = 'L' + scope.getNewLabel();
            let booleanLabel = 'L' + scope.getNewLabel();
            let endStringLabel = 'L' + scope.getNewLabel();
            let endLabel = 'L' + scope.getNewLabel();
            
            let temp = 't'+scope.getNewTemp(); 
            this.code3d+= stringLabel +':\n';
            this.code3d+=temp + '=Heap[(int)'+stringPointer+'];\n';
            this.code3d+='if('+temp + '==' +'\0'.charCodeAt(0) + ') goto ' + endStringLabel + ';\n';
            this.code3d+= 'if('+temp + '=='+ '-1) goto ' + integerLabel + ';\n';
            this.code3d+= 'if('+temp + '=='+ '-2) goto ' + doubleLabel + ';\n';
            this.code3d+= 'if('+temp + '=='+ '-3) goto ' + booleanLabel + ';\n';
            this.code3d+= 'printf("%c",(int)'+temp+');\n';
            this.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
            this.code3d+= 'goto ' + stringLabel + ';\n';

            this.code3d+= integerLabel + ':\n';
            this.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
            this.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
            this.code3d+= 'printf("%f",'+temp+');\n';
            this.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
            this.code3d+= 'goto ' + stringLabel + ';\n';
            
            this.code3d+= doubleLabel + ':\n';
            this.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
            this.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
            this.code3d+= 'printf("%f",'+temp+');\n';
            this.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
            this.code3d+= 'goto ' + stringLabel + ';\n';
            
            this.code3d+= booleanLabel + ':\n';
                this.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                this.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
                this.code3d+= 'printf("%c",(int)'+temp+');\n';
                this.code3d+= 'goto ' + endLabel + ';\n';
                
                
                this.code3d+= endLabel + ':\n';
                this.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                this.code3d+= 'goto ' + stringLabel + ';\n';

            this.code3d+=endStringLabel+':\n\n';
                
        }
        return this;
    }

}
module.exports = Print;