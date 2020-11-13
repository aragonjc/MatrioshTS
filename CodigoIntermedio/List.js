const tsObject = require('./tsObject');

class List {
    constructor(isArray,expOrId,auxP) {
        this.isArray = isArray;
        this.expOrId = expOrId;
        this.auxP = auxP;
        this.obj = null;
        this.param = null;
        this.cond = false;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {

        //console.log(this.obj);
        if(this.obj.isArray && !this.isArray) {
            if(this.expOrId == 'length' && this.auxP == null) {
                //console.log(this.obj);
                let newTsObject = new tsObject(0,0,null,'number');
                
                newTsObject.code3d += this.obj.code3d;
                if(this.obj.arrLen != 0) {
                    let auxTemp = 't' + scope.getNewTemp();
                    newTsObject.code3d += auxTemp + '='+this.obj.arrLen+';\n';
                    newTsObject.pointer = auxTemp;
                } else {
                    let posFinal = 't' + scope.getNewTemp();
                    let posInicial = 't' + scope.getNewTemp();
                    let pointer = 't' + scope.getNewTemp();
                    newTsObject.code3d += posFinal + '='+this.obj.arrFinal+';\n';
                    newTsObject.code3d += posInicial + '='+this.obj.pointer+';\n';
                    newTsObject.code3d += pointer + '='+posFinal+'-'+posInicial+';\n';
                    newTsObject.code3d += pointer + '='+pointer+'/2;\n';
                    newTsObject.pointer = pointer;
                }
                
                return newTsObject;
            } else {
                console.log("ERROR un arreglo no tiene esa propiedad");
                return null;
            }
        }

        if(this.obj.type == 'string' && !this.isArray) {
            
            if(this.expOrId == 'length' && this.auxP == null) {
                console.log("aqui no deberia de entrar");
                let newTsObject = new tsObject(0,0,null,'number');
                newTsObject.code3d += this.obj.code3d;

                let stringPointer = 't'+scope.getNewTemp();
                let counTemp = 't' + scope.getNewTemp();

                
                let stringLabel = 'L'+scope.getNewLabel();
                let integerLabel = 'L' + scope.getNewLabel();
                let doubleLabel = 'L' + scope.getNewLabel();
                let booleanLabel = 'L' + scope.getNewLabel();
                let booleanLabelT = 'L' + scope.getNewLabel();
                let endStringLabel = 'L' + scope.getNewLabel();
                let endLabel = 'L' + scope.getNewLabel();
                
                let temp = 't'+scope.getNewTemp(); 

                newTsObject.code3d += stringPointer + '=' + this.obj.pointer+';\n';
                newTsObject.code3d += counTemp + '= 0;\n';

                newTsObject.code3d+= stringLabel +':\n';
                newTsObject.code3d+=temp + '=Heap[(int)'+stringPointer+'];\n';
                newTsObject.code3d+='if('+temp + '==' +'\0'.charCodeAt(0) + ') goto ' + endStringLabel + ';\n';
                newTsObject.code3d+= 'if('+temp + '=='+ '-1) goto ' + integerLabel + ';\n';
                newTsObject.code3d+= 'if('+temp + '=='+ '-2) goto ' + doubleLabel + ';\n';
                newTsObject.code3d+= 'if('+temp + '=='+ '-3) goto ' + booleanLabel + ';\n';
                //this.code3d+= 'printf("%c",(int)'+temp+');\n';
                newTsObject.code3d+= counTemp + '= '+counTemp+' + 1;\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';

                newTsObject.code3d+= integerLabel + ':\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
                //this.code3d+= 'printf("%f",'+temp+');\n';
                newTsObject.code3d+= counTemp + '= '+counTemp+' + 1;\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';
                
                newTsObject.code3d+= doubleLabel + ':\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
                //this.code3d+= 'printf("%f",'+temp+');\n';
                newTsObject.code3d+= counTemp + '= '+counTemp+' + 1;\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';
                
                newTsObject.code3d+= booleanLabel + ':\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
                //this.code3d+= 'printf("%c",(int)'+temp+');\n';
                newTsObject.code3d+= counTemp + '= '+counTemp+' + 1;\n';
                newTsObject.code3d+= 'goto ' + endLabel + ';\n';
                
                
                newTsObject.code3d+= endLabel + ':\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';

                newTsObject.code3d+=endStringLabel+':\n\n';
                newTsObject.pointer = counTemp;

                return newTsObject;

            } if(this.expOrId == 'CharAt' && this.auxP == null && this.param != null) {
                console.log("aqui si")
                let charAt = this.param[0];
                charAt = charAt.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);

                let newTsObject = new tsObject(0,0,null,'string');
                newTsObject.code3d += this.obj.code3d;
                newTsObject.code3d += charAt.code3d;
                //newTsObject.code3d += 'printf("char: %f",'+charAt.pointer+');'

                let stringPointer = 't'+scope.getNewTemp();
                let counTemp = 't' + scope.getNewTemp();

                
                let stringLabel = 'L'+scope.getNewLabel();
                let integerLabel = 'L' + scope.getNewLabel();
                let doubleLabel = 'L' + scope.getNewLabel();
                let booleanLabel = 'L' + scope.getNewLabel();
                let booleanLabelT = 'L' + scope.getNewLabel();
                let endStringLabel = 'L' + scope.getNewLabel();
                let endLabel = 'L' + scope.getNewLabel();
                
                let temp = 't'+scope.getNewTemp(); 

                newTsObject.code3d += stringPointer + '=' + this.obj.pointer+';\n';
                newTsObject.code3d += counTemp + '= 0;\n';

                newTsObject.code3d+= stringLabel +':\n';
                newTsObject.code3d+=temp + '=Heap[(int)'+stringPointer+'];\n';
                newTsObject.code3d+='if('+counTemp + '==' +charAt.pointer+ ') goto ' + endStringLabel + ';\n';
                newTsObject.code3d+='if('+temp + '==' +'\0'.charCodeAt(0) + ') goto ' + endStringLabel + ';\n';
                newTsObject.code3d+= 'if('+temp + '=='+ '-1) goto ' + integerLabel + ';\n';
                newTsObject.code3d+= 'if('+temp + '=='+ '-2) goto ' + doubleLabel + ';\n';
                newTsObject.code3d+= 'if('+temp + '=='+ '-3) goto ' + booleanLabel + ';\n';
                //this.code3d+= 'printf("%c",(int)'+temp+');\n';
                newTsObject.code3d+= counTemp + '= '+counTemp+' + 1;\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';

                newTsObject.code3d+= integerLabel + ':\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
                //this.code3d+= 'printf("%f",'+temp+');\n';
                newTsObject.code3d+= counTemp + '= '+counTemp+' + 1;\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';
                
                newTsObject.code3d+= doubleLabel + ':\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
                //this.code3d+= 'printf("%f",'+temp+');\n';
                newTsObject.code3d+= counTemp + '= '+counTemp+' + 1;\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';
                
                newTsObject.code3d+= booleanLabel + ':\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
                //this.code3d+= 'printf("%c",(int)'+temp+');\n';
                newTsObject.code3d+= counTemp + '= '+counTemp+' + 1;\n';
                newTsObject.code3d+= 'goto ' + endLabel + ';\n';
                
                
                newTsObject.code3d+= endLabel + ':\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';

                newTsObject.code3d+=endStringLabel+':\n\n';
                //newTsObject.pointer = temp;


                let newTemp = 't' + scope.getNewTemp();
                let newTempCounter = 't' + scope.getNewTemp();
                newTsObject.pointer = newTemp;
                
                newTsObject.code3d += '\n//////////////////////////////////\n';
                newTsObject.code3d += newTemp + '=H;\n';
                newTsObject.code3d += newTempCounter + '=H;\n';
                newTsObject.code3d += 'Heap[(int)' + newTempCounter + '] = ' + temp + ';\n'
                newTsObject.code3d += newTempCounter + '=' + newTempCounter + '+1;\n'
                newTsObject.code3d += 'Heap[(int)'+newTempCounter+']='+'\0'.charCodeAt(0)+';\n';
                newTsObject.code3d += newTempCounter + '='+newTempCounter + '+1;\n';
                newTsObject.code3d += 'H=' + newTempCounter +';\n';
                newTsObject.value = undefined;
                newTsObject.code3d += '\n//////////////////////////////////\n';

                return newTsObject;

            } if(this.expOrId == 'ToLowerCase' && this.auxP == null) {
                //console.log("aqui si")
                //let charAt = this.param[0];
                //charAt = charAt.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);

                let newTsObject = new tsObject(0,0,null,'string');
                newTsObject.code3d += this.obj.code3d;
                //newTsObject.code3d += charAt.code3d;
                //newTsObject.code3d += 'printf("char: %f",'+charAt.pointer+');'

                let newstringPointer = 't' + scope.getNewTemp();
                let newPointer = 't' + scope.getNewTemp();
                let stringPointer = 't'+scope.getNewTemp();
                let counTemp = 't' + scope.getNewTemp();

                
                let stringLabel = 'L'+scope.getNewLabel();
                let integerLabel = 'L' + scope.getNewLabel();
                let doubleLabel = 'L' + scope.getNewLabel();
                let booleanLabel = 'L' + scope.getNewLabel();
                let booleanLabelT = 'L' + scope.getNewLabel();
                let endStringLabel = 'L' + scope.getNewLabel();
                let endLabel = 'L' + scope.getNewLabel();
                let lowLabel = 'L' + scope.getNewLabel();
                
                let temp = 't'+scope.getNewTemp(); 
                
                newTsObject.code3d += newstringPointer + '=H;\n'
                newTsObject.code3d += newPointer + '=H;\n'
                newTsObject.code3d += stringPointer + '=' + this.obj.pointer+';\n';
                

                newTsObject.code3d+= stringLabel +':\n';
                newTsObject.code3d+=temp + '=Heap[(int)'+stringPointer+'];\n';
                newTsObject.code3d+='if('+temp + '==' +'\0'.charCodeAt(0) + ') goto ' + endStringLabel + ';\n';
                newTsObject.code3d+= 'if('+temp + '=='+ '-1) goto ' + integerLabel + ';\n';
                newTsObject.code3d+= 'if('+temp + '=='+ '-2) goto ' + doubleLabel + ';\n';
                //newTsObject.code3d+= 'if('+temp + '=='+ '-3) goto ' + booleanLabel + ';\n';
                
                newTsObject.code3d += 'if(' + temp + ' > 90) goto ' + lowLabel + ';\n';
                newTsObject.code3d += 'if(' + temp + ' < 65) goto ' + lowLabel + ';\n';
                newTsObject.code3d += temp + ' = ' + temp + ' + 32;\n';
                newTsObject.code3d+=lowLabel+':\n';
                newTsObject.code3d+= 'Heap[(int)'+newstringPointer+']='+temp+';\n';
                newTsObject.code3d+= newstringPointer + '=' + newstringPointer + '+1;\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';

                //INT
                newTsObject.code3d+= integerLabel + ':\n';
                newTsObject.code3d+= 'Heap[(int)'+newstringPointer+']='+temp+';\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= newstringPointer + '=' + newstringPointer + '+1;\n';
                newTsObject.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
                newTsObject.code3d+= 'Heap[(int)'+newstringPointer+']='+temp+';\n';
                newTsObject.code3d+= newstringPointer + '=' + newstringPointer + '+1;\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';
                //DOUBLE
                newTsObject.code3d+= doubleLabel + ':\n';
                newTsObject.code3d+= 'Heap[(int)'+newstringPointer+']='+temp+';\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= newstringPointer + '=' + newstringPointer + '+1;\n';
                newTsObject.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
                newTsObject.code3d+= 'Heap[(int)'+newstringPointer+']='+temp+';\n';
                newTsObject.code3d+= newstringPointer + '=' + newstringPointer + '+1;\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';
                
                /*newTsObject.code3d+= booleanLabel + ':\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
                //this.code3d+= 'printf("%c",(int)'+temp+');\n';
                newTsObject.code3d+= counTemp + '= '+counTemp+' + 1;\n';
                newTsObject.code3d+= 'goto ' + endLabel + ';\n';*/
                
                
                //newTsObject.code3d+= endLabel + ':\n';
                

                newTsObject.code3d+=endStringLabel+':\n';
                newTsObject.code3d+= 'Heap[(int)'+newstringPointer+']='+temp+';\n';
                newTsObject.code3d+= newstringPointer + '=' + newstringPointer + '+1;\n';
                newTsObject.code3d += 'H=' + newstringPointer +';\n';
                newTsObject.pointer = newPointer;
                


                

                return newTsObject;

            } if(this.expOrId == 'ToUpperCase' && this.auxP == null) {
                //console.log("aqui si")
                //let charAt = this.param[0];
                //charAt = charAt.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);

                let newTsObject = new tsObject(0,0,null,'string');
                newTsObject.code3d += this.obj.code3d;
                //newTsObject.code3d += charAt.code3d;
                //newTsObject.code3d += 'printf("char: %f",'+charAt.pointer+');'

                let newstringPointer = 't' + scope.getNewTemp();
                let newPointer = 't' + scope.getNewTemp();
                let stringPointer = 't'+scope.getNewTemp();
                let counTemp = 't' + scope.getNewTemp();

                
                let stringLabel = 'L'+scope.getNewLabel();
                let integerLabel = 'L' + scope.getNewLabel();
                let doubleLabel = 'L' + scope.getNewLabel();
                let booleanLabel = 'L' + scope.getNewLabel();
                let booleanLabelT = 'L' + scope.getNewLabel();
                let endStringLabel = 'L' + scope.getNewLabel();
                let endLabel = 'L' + scope.getNewLabel();
                let lowLabel = 'L' + scope.getNewLabel();
                
                let temp = 't'+scope.getNewTemp(); 
                
                newTsObject.code3d += newstringPointer + '=H;\n'
                newTsObject.code3d += newPointer + '=H;\n'
                newTsObject.code3d += stringPointer + '=' + this.obj.pointer+';\n';
                

                newTsObject.code3d+= stringLabel +':\n';
                newTsObject.code3d+=temp + '=Heap[(int)'+stringPointer+'];\n';
                newTsObject.code3d+='if('+temp + '==' +'\0'.charCodeAt(0) + ') goto ' + endStringLabel + ';\n';
                newTsObject.code3d+= 'if('+temp + '=='+ '-1) goto ' + integerLabel + ';\n';
                newTsObject.code3d+= 'if('+temp + '=='+ '-2) goto ' + doubleLabel + ';\n';
                //newTsObject.code3d+= 'if('+temp + '=='+ '-3) goto ' + booleanLabel + ';\n';
                
                newTsObject.code3d += 'if(' + temp + ' > 122) goto ' + lowLabel + ';\n';
                newTsObject.code3d += 'if(' + temp + ' < 97) goto ' + lowLabel + ';\n';
                newTsObject.code3d += temp + ' = ' + temp + ' - 32;\n';
                newTsObject.code3d+=lowLabel+':\n';
                newTsObject.code3d+= 'Heap[(int)'+newstringPointer+']='+temp+';\n';
                newTsObject.code3d+= newstringPointer + '=' + newstringPointer + '+1;\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';

                //INT
                newTsObject.code3d+= integerLabel + ':\n';
                newTsObject.code3d+= 'Heap[(int)'+newstringPointer+']='+temp+';\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= newstringPointer + '=' + newstringPointer + '+1;\n';
                newTsObject.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
                newTsObject.code3d+= 'Heap[(int)'+newstringPointer+']='+temp+';\n';
                newTsObject.code3d+= newstringPointer + '=' + newstringPointer + '+1;\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';
                //DOUBLE
                newTsObject.code3d+= doubleLabel + ':\n';
                newTsObject.code3d+= 'Heap[(int)'+newstringPointer+']='+temp+';\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= newstringPointer + '=' + newstringPointer + '+1;\n';
                newTsObject.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
                newTsObject.code3d+= 'Heap[(int)'+newstringPointer+']='+temp+';\n';
                newTsObject.code3d+= newstringPointer + '=' + newstringPointer + '+1;\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';
                
                /*newTsObject.code3d+= booleanLabel + ':\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
                //this.code3d+= 'printf("%c",(int)'+temp+');\n';
                newTsObject.code3d+= counTemp + '= '+counTemp+' + 1;\n';
                newTsObject.code3d+= 'goto ' + endLabel + ';\n';*/
                
                
                //newTsObject.code3d+= endLabel + ':\n';
                

                newTsObject.code3d+=endStringLabel+':\n';
                newTsObject.code3d+= 'Heap[(int)'+newstringPointer+']='+temp+';\n';
                newTsObject.code3d+= newstringPointer + '=' + newstringPointer + '+1;\n';
                newTsObject.code3d += 'H=' + newstringPointer +';\n';
                newTsObject.pointer = newPointer;
                


                

                return newTsObject;

            } if(this.expOrId == 'Concat' && this.auxP == null && this.param != null) {

                let str = this.param[0];
                str = str.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);

                let newTsObject = new tsObject(0,0,null,'string');
                newTsObject.code3d += this.obj.code3d;
                newTsObject.code3d += str.code3d;
                
                let actualPointer = 't'+scope.getNewTemp();
                let newActualPointer = 't' + scope.getNewTemp();
                let temp = 't' + scope.getNewTemp();
                let auxTemp = 't'+scope.getNewTemp();
                let stringPos1 = 't' + scope.getNewTemp();
                let stringPos2 = 't' + scope.getNewTemp();
                let leftString = 'L' + scope.getNewLabel();
                let exitLeftString = 'L' + scope.getNewLabel();
                let rigthString = 'L' + scope.getNewLabel();
                let exitRigthString = 'L' + scope.getNewLabel();
                let exitLabel = 'L' + scope.getNewLabel();

                newTsObject.code3d += actualPointer + '=H;\n';
                newTsObject.code3d += newActualPointer + '=H;\n';
                newTsObject.code3d += stringPos1 + '=' + this.obj.pointer + ';\n';
                //newObject.code3d += 'Aqui pongo el apuntador 1\n';
                newTsObject.code3d += stringPos2 + '=' + str.pointer + ';\n';
                //newObject.code3d += 'Aqui pongo el apuntador 2\n';

                newTsObject.code3d += leftString + ':\n';
                newTsObject.code3d += temp + '= Heap[(int)' + stringPos1 + '];\n';
                newTsObject.code3d += 'if('+ temp +' == ' + '\0'.charCodeAt(0) + ') goto ' + exitLeftString +';\n';
                newTsObject.code3d += 'Heap[(int)' + newActualPointer + '] = ' + temp + ';\n';
                newTsObject.code3d += newActualPointer + '=' + newActualPointer + '+1;\n';
                newTsObject.code3d += stringPos1 + '=' + stringPos1 + '+1;\n';
                //newObject.code3d += temp + '= Heap[' + newActualPointer + '];\n';
                newTsObject.code3d += 'goto ' + leftString + ';\n';
                newTsObject.code3d += exitLeftString + ':\n\n';
                
                newTsObject.code3d += rigthString + ':\n';
                newTsObject.code3d += temp + ' = Heap[(int)' + stringPos2 + '];\n';
                newTsObject.code3d += 'if('+ temp + ' == ' + '\0'.charCodeAt(0) + ') goto ' + exitLabel +';\n';
                newTsObject.code3d += 'Heap[(int)' + newActualPointer + '] = ' + temp + ';\n';
                newTsObject.code3d += newActualPointer + '=' + newActualPointer + '+1;\n';
                newTsObject.code3d += stringPos2 + '=' + stringPos2 + '+1;\n';
                newTsObject.code3d += 'goto ' + rigthString + ';\n';
                newTsObject.code3d += exitLabel + ':\n';
                newTsObject.code3d += 'Heap[(int)' + newActualPointer +'] = ' + '\0'.charCodeAt(0) + ';\n';
                newTsObject.code3d += newActualPointer + '=' + newActualPointer + '+ 1;\n';
                newTsObject.code3d += 'H = ' + newActualPointer + ';\n\n';
                newTsObject.pointer = actualPointer;
                
                return newTsObject;
            }
            
            else {  
                console.log("ERROR de string");
                return null;
            }
        }
        
        if(this.cond) {
            if(this.isArray) {

                const index = this.expOrId.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
                if(index.type == 'number') {
    
                    let counter = 't' + scope.getNewTemp();
                    let position = 't' + scope.getNewTemp();
                    let cond = 't' + scope.getNewTemp();
                    let pointer = 't' + scope.getNewTemp();
    
                    let startLabel = 'L' + scope.getNewLabel();
                    let valueLabel = 'L' + scope.getNewLabel();
                    let numberLabel = 'L' + scope.getNewLabel();
                    let booleanLabel = 'L' + scope.getNewLabel();
                    let stringLabel = 'L' + scope.getNewLabel();
                    let arrayLabel = 'L' + scope.getNewLabel();
                    let typeLabel = 'L' + scope.getNewLabel();
                    let primLabel = 'L' + scope.getNewLabel();
                    let exitLabel = 'L' + scope.getNewLabel();
                   
                    
    
    
                    let newTsObject = new tsObject(0,0,null,null);
                    newTsObject.type = this.obj.type;
                    newTsObject.code3d += this.obj.code3d;
                    newTsObject.pointer = pointer;
                    newTsObject.code3d += index.code3d;
                    newTsObject.code3d += counter + ' = 0;\n';
                    newTsObject.code3d += position + ' = '+this.obj.pointer+';\n';

                    newTsObject.code3d += startLabel + ':\n';
                    newTsObject.code3d += 'if('+index.pointer+'=='+counter+') goto '+valueLabel+';/////////\n';
                    newTsObject.code3d += counter + '='+counter+' +1;\n';
                    newTsObject.code3d += position + '='+position+' +2;\n';
                    newTsObject.code3d += 'goto '+startLabel+';\n';
                    newTsObject.code3d += valueLabel + ':\n';
                    newTsObject.code3d += cond +'=Heap[(int)'+position+'];\n';
                    //newTsObject.code3d += 'if('+cond+'==-1) goto '+numberLabel+';\n';
                    /*newTsObject.code3d += 'if('+cond+'==-2) goto '+booleanLabel+';\n';
                    newTsObject.code3d += 'if('+cond+'==-30) goto '+stringLabel+';\n';*/
                    newTsObject.code3d += 'if('+cond+'==-4) goto '+arrayLabel+';\n';
                    newTsObject.code3d += 'if('+cond+'==-5) goto '+typeLabel+';\n';
    
                    newTsObject.code3d += primLabel + ':\n';
                    newTsObject.code3d += position + '='+ position + '+1;\n';
                    newTsObject.code3d += pointer + ' = '+position+';\n'
                    newTsObject.code3d += 'goto '+exitLabel+';\n';
    
                    
                    newTsObject.code3d += arrayLabel + ':\n';
                    newTsObject.code3d += position + '='+ position + '+1;\n';
                    
                    if(this.auxP) {

                        newTsObject.code3d += pointer + '=Heap[(int)'+position+'];\n'
                        let outLabel = 'L' + scope.getNewLabel();
                        let endTemp = 't' + scope.getNewTemp();
                        if(this.obj.list.length > 0) {
                            newTsObject.isArray = true;
                            newTsObject.arrFinal = endTemp;
                            this.obj.list.forEach(element => {
                                newTsObject.code3d += endTemp + '='+element.fin+';\n';
                                newTsObject.code3d += 'if('+element.pointer+'=='+pointer+')goto '+outLabel+';\n';
                            });
                        }
                        newTsObject.code3d += outLabel + ':\n';

                    } else {
                        
                        newTsObject.code3d += pointer + '=Heap[(int)'+position+'];\n'
                    }

                    newTsObject.code3d += 'goto '+exitLabel+';\n';
    
    
                    newTsObject.code3d += typeLabel + ':\n';
                    newTsObject.code3d += position + '='+ position + '+1;\n';
                    //FALTA
                    newTsObject.code3d += 'goto '+exitLabel+';\n';
    
                    newTsObject.code3d += exitLabel + ':\n';
    
                    if(this.auxP) {
                        this.auxP.obj = newTsObject;
                        this.auxP.cond = true;
                        //console.log(newTsObject);
                        const auxPRes = this.auxP.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
                        //newTsObject.code3d += auxPRes.code3d;
                        //newTsObject.isArray = auxPRes.isArray;
                        //newTsObject.arrFinal = auxPRes.arrFinal;
                        //newTsObject.pointer = auxPRes.pointer;
                        
                        return auxPRes;
                    }
    
                    return newTsObject;
                } else {
                    console.log("La posicion del arreglo debe ser un tipo number");
                }
    
            } else {
                //TYPE
            }
        } else {
            if(this.isArray) {

                const index = this.expOrId.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
                if(index.type == 'number') {
    
                    let counter = 't' + scope.getNewTemp();
                    let position = 't' + scope.getNewTemp();
                    let cond = 't' + scope.getNewTemp();
                    let pointer = 't' + scope.getNewTemp();
    
                    let startLabel = 'L' + scope.getNewLabel();
                    let valueLabel = 'L' + scope.getNewLabel();
                    let numberLabel = 'L' + scope.getNewLabel();
                    let booleanLabel = 'L' + scope.getNewLabel();
                    let stringLabel = 'L' + scope.getNewLabel();
                    let arrayLabel = 'L' + scope.getNewLabel();
                    let typeLabel = 'L' + scope.getNewLabel();
                    let primLabel = 'L' + scope.getNewLabel();
                    let exitLabel = 'L' + scope.getNewLabel();
                   
                    
    
    
                    let newTsObject = new tsObject(0,0,null,null);
                    newTsObject.type = this.obj.type;
                    newTsObject.code3d += this.obj.code3d;
                    newTsObject.pointer = pointer;
                    newTsObject.code3d += index.code3d;
                    newTsObject.code3d += counter + ' = 0;\n';
                    newTsObject.code3d += position + ' = '+this.obj.pointer+';\n';
                    newTsObject.code3d += startLabel + ':\n';
                    newTsObject.code3d += 'if('+index.pointer+'=='+counter+') goto '+valueLabel+';/////////\n';
                    newTsObject.code3d += counter + '='+counter+' +1;\n';
                    newTsObject.code3d += position + '='+position+' +2;\n';
                    newTsObject.code3d += 'goto '+startLabel+';\n';
                    newTsObject.code3d += valueLabel + ':\n';
                    newTsObject.code3d += cond +'=Heap[(int)'+position+'];\n';
                    //newTsObject.code3d += 'if('+cond+'==-1) goto '+numberLabel+';\n';
                    /*newTsObject.code3d += 'if('+cond+'==-2) goto '+booleanLabel+';\n';
                    newTsObject.code3d += 'if('+cond+'==-30) goto '+stringLabel+';\n';*/
                    newTsObject.code3d += 'if('+cond+'==-4) goto '+arrayLabel+';\n';
                    newTsObject.code3d += 'if('+cond+'==-5) goto '+typeLabel+';\n';
    
                    newTsObject.code3d += primLabel + ':\n';
                    newTsObject.code3d += position + '='+ position + '+1;\n';
                    newTsObject.code3d += pointer + '=Heap[(int)'+position+'];\n'
                    newTsObject.code3d += 'goto '+exitLabel+';\n';
    
                    
                    newTsObject.code3d += arrayLabel + ':\n';
                    newTsObject.code3d += position + '='+ position + '+1;\n';
                    newTsObject.code3d += pointer + '=Heap[(int)'+position+'];\n'
                    //newTsObject.code3d += pointer + '=Stack[(int)'+pointer+'];\n'
                    let outLabel = 'L' + scope.getNewLabel();
                    let endTemp = 't' + scope.getNewTemp();
    
                   // console.log(this.obj);
                    if(this.obj.list.length > 0) {
                        newTsObject.isArray = true;
                        newTsObject.arrFinal = endTemp;
                        this.obj.list.forEach(element => {
                            newTsObject.code3d += endTemp + '='+element.fin+';\n';
                            newTsObject.code3d += 'if('+element.pointer+'=='+pointer+')goto '+outLabel+';\n';
                        });
                    }
                    
                   
                    newTsObject.code3d += outLabel + ':\n';
                    newTsObject.code3d += 'goto '+exitLabel+';\n';
    
    
                    newTsObject.code3d += typeLabel + ':\n';
                    newTsObject.code3d += position + '='+ position + '+1;\n';
                    //FALTA
                    newTsObject.code3d += 'goto '+exitLabel+';\n';
    
                    newTsObject.code3d += exitLabel + ':\n';
    
                    if(this.auxP) {
                        this.auxP.obj = newTsObject;
                        //console.log(newTsObject);
                        const auxPRes = this.auxP.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
                        //newTsObject.code3d += auxPRes.code3d;
                        //newTsObject.isArray = auxPRes.isArray;
                        //newTsObject.arrFinal = auxPRes.arrFinal;
                        //newTsObject.pointer = auxPRes.pointer;
                        
                        return auxPRes;
                    }
    
                    return newTsObject;
                } else {
                    console.log("La posicion del arreglo debe ser un tipo number");
                }
    
            } else {
                //Type
            }
        }

        

    }
}
module.exports = List;