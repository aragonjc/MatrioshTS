const tsObject = require('./tsObject');
class Print {

    constructor(value,line){
        this.pointer = null;
        this.type = null;
        this.value = value;
        this.line = line;
        this.code3d = '';
        this.dataType = 'print';
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
            
        let printValue = this.value[0].translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        
        this.code3d = '';
        //console.log(printValue);
        if(printValue === null || printValue === undefined) {
            //add to errors table
            console.log('ERROR en print')
            
            return;
        }

        this.code3d += printValue.code3d;
        if(printValue.isArray) {

            let counterTemp = 't' + scope.getNewTemp(); 
            let finalPosition = 't' + scope.getNewTemp();
            let condTemp = 't' + scope.getNewTemp();
            let auxTemp = 't' + scope.getNewTemp();
            let comaTemp = 't' + scope.getNewTemp();
            let countCommaTemp = 't' + scope.getNewTemp();
            //let secondTemp = 't' + scope.getNewTemp();
            let newObj = null;
            let pclone = null;
            let list = null;

            
            let loopArray = 'L' + scope.getNewLabel();
            let exitLable = 'L' + scope.getNewLabel();
            let intLabel = 'L' + scope.getNewLabel();
            let boolLabel = 'L' + scope.getNewLabel();
            let stringLabel = 'L' + scope.getNewLabel();
            let arrayLabel = 'L' + scope.getNewLabel();
            let typeLabel = 'L' + scope.getNewLabel();
            let commaLabel = 'L' + scope.getNewLabel();

            this.code3d += 'printf("[");\n';
            this.code3d += counterTemp + ' = Stack[(int)' + printValue.pointer + '];\n';
            this.code3d += finalPosition + ' = '+printValue.arrFinal+';\n';
            this.code3d += countCommaTemp + '=0;\n';

            this.code3d += loopArray + ':\n';
            this.code3d += condTemp + '= ' + counterTemp + ' == ' + finalPosition + ';\n';
            this.code3d += 'if('+condTemp+') goto '+exitLable+';\n';

            this.code3d += comaTemp + '='+countCommaTemp+' == 0;\n';
            this.code3d += 'if('+comaTemp+')goto '+commaLabel+';\n';
            this.code3d += 'printf(",");\n'
            this.code3d += commaLabel + ':\n';
            this.code3d += countCommaTemp + '=' + countCommaTemp + '+1;\n';


            this.code3d += auxTemp + ' = Heap[(int)'+counterTemp+'];\n';
            //condiciones
            this.code3d += condTemp + '= '+auxTemp+' == -1;\n';
            this.code3d += 'if('+condTemp+') goto '+intLabel+';\n';
            this.code3d += condTemp + '= '+auxTemp+' == -2;\n';
            this.code3d += 'if('+condTemp+') goto '+boolLabel+';\n';
            this.code3d += condTemp + '= '+auxTemp+' == -30;\n';
            this.code3d += 'if('+condTemp+') goto '+stringLabel+';\n';
            this.code3d += condTemp + '= '+auxTemp+' == -4;\n';
            this.code3d += 'if('+condTemp+') goto '+arrayLabel+';\n';
            this.code3d += condTemp + '= '+auxTemp+' == -5;\n';
            this.code3d += 'if('+condTemp+') goto '+typeLabel+';\n';

            this.code3d += intLabel + ':\n';//INT LABEL
            this.code3d += counterTemp + ' = ' + counterTemp + ' + 1;\n';
            this.code3d += auxTemp + '=Heap[(int)'+counterTemp+'];\n'//puntero
            this.code3d += 'printf("%f",'+auxTemp+');\n';
            //this.code3d += 'printf(",");\n';
            this.code3d += counterTemp + ' = ' + counterTemp + ' + 1;\n';
            this.code3d += 'goto '+loopArray+';\n';//FIN INT LABEL

            this.code3d += boolLabel + ':\n';//BOOL LABEL
            this.code3d += counterTemp + ' = ' + counterTemp + ' + 1;\n';
            this.code3d += auxTemp + '=Heap[(int)'+counterTemp+'];\n'//puntero
            newObj = new tsObject(0,0,null,'boolean');
            newObj.pointer = auxTemp;
            pclone = new Print([newObj]);
            pclone = pclone.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
            this.code3d += pclone.code3d;
            //this.code3d += 'printf(",");\n';
            this.code3d += counterTemp + ' = ' + counterTemp + ' + 1;\n';
            this.code3d += 'goto '+loopArray+';\n';//FIN BOOL LABEL


            this.code3d += stringLabel + ':\n';
            this.code3d += counterTemp + ' = ' + counterTemp + ' + 1;\n';
            this.code3d += auxTemp + '=Heap[(int)'+counterTemp+'];\n'//puntero
            newObj = new tsObject(0,0,null,'string');
            newObj.pointer = auxTemp;
            pclone = new Print([newObj]);
            pclone = pclone.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
            this.code3d += pclone.code3d;
            this.code3d += counterTemp + ' = ' + counterTemp + ' + 1;\n';
            this.code3d += 'goto '+loopArray+';\n';//FIN BOOL LABEL
            

            this.code3d += arrayLabel + ':\n';//INITial ARRAY
            //this.code3d += 'printf("\\n[");\n';
            
            if(printValue.list.length > 0) {
                let count = 0;
                printValue.list.forEach(val => {
                    if(count > 0) {
                        this.code3d += 'printf(",");\n';
                    }
                    list = val;
                    console.log(list);
                    this.code3d += counterTemp + ' = ' + counterTemp + ' + 1;\n';
                    this.code3d += auxTemp + '=Heap[(int)'+counterTemp+'];\n'//puntero
                    newObj = new tsObject(0,0,null,list.tipo);
                    newObj.pointer = auxTemp;
                    newObj.arrFinal = list.fin;
                    newObj.isArray = true;
                    pclone = new Print([newObj]);
                    pclone = pclone.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
                    this.code3d += pclone.code3d;
                    this.code3d += counterTemp + ' = ' + counterTemp + ' + 1;\n';
                    count++;
                });

                /*console.log(printValue);
                list = printValue.list.pop();
                console.log(list);*/
                
                
            }
            //this.code3d += 'printf("]");\n';
            this.code3d += 'goto '+loopArray+';\n';//FIN ARRAY

            this.code3d += typeLabel + ':\n';

            this.code3d += exitLable + ':\n\n';
            this.code3d += 'printf("]");\n';

        }else if(printValue.type == 'number') {
            this.code3d += 'printf("%f",' + printValue.pointer + ');\n';
            //this.code3d += 'printf("\\n");\n';
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
                
        } else if(printValue.type === 'boolean') {
            let labelTrue = 'L'+scope.getNewLabel();
            let labelFalse = 'L'+scope.getNewLabel();
            let exitLabel = 'L'+scope.getNewLabel();
            this.code3d += 'if(' + printValue.pointer  + '== 1)goto '+ labelTrue +';\n'
            this.code3d += labelFalse + ':\n';
            this.code3d += 'printf("%c",102);\n';
            this.code3d += 'printf("%c",97);\n';
            this.code3d += 'printf("%c",108);\n';
            this.code3d += 'printf("%c",115);\n';
            this.code3d += 'printf("%c",101);\n';
            this.code3d += 'goto ' + exitLabel + ';\n';
            this.code3d += labelTrue + ':\n';
            this.code3d += 'printf("%c",116);\n';
            this.code3d += 'printf("%c",114);\n';
            this.code3d += 'printf("%c",117);\n';
            this.code3d += 'printf("%c",101);\n\n';

            this.code3d += exitLabel + ':\n\n\n';
        } 
        return this;
    }

}
module.exports = Print;