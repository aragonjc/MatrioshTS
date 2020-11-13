const gramatica = require('./gramatica')
const scope = require('./CodigoIntermedio/Scope')
const fs = require('fs')

let entrada;
try {
    entrada = fs.readFileSync('./archivo.ts');
} catch (e) {
    console.error(e);
    return;
}

function check(element) {
    if(element.constructor.name == "Function") {
        return false;
    } else if(element.constructor.name == "Variable"/* ||element.constructor.name == "VariableChange" */) {
        return false;
    } else if(element.constructor.name == "decType") {
        return false;
    } else {
        return true;
    }
}

let Scope = new scope(null,0,0);
let ast = gramatica.parse(entrada.toString());
let code = '';
code += '#include <stdio.h>\n\n';
code += 'float P = 0;\n';
code += 'float H = 0;\n';
code += 'float Stack[16394];\n';
code += 'float Heap[16384];\n'
let terminals = 'float t1';

let Globales = '';
let Funciones = '';
let Main = '\n\nvoid main(){\n';

ast.forEach(element => {
    if(element.constructor.name == "Variable" /*||element.constructor.name == "VariableChange"*/ ) {
        //console.log(element)
        let r = element.translate(Scope,null,null,null,null,null); 
        Globales += r.code3d;
    }
})

ast.forEach(element => {
    if(element.constructor.name == "Function") {
        let r = element.translate(Scope,null,null,null,null,null);
        Funciones += r.code3d;
    }
})


ast.forEach(element => {
    if(check(element)) {
        let r = element.translate(Scope,null,null,null,null,null); 
        Main += r.code3d;
    }
});
Main += 'return;\n}';


for(let i = 1;i<Scope.terminal;i++){
   terminals +=  ',t'+(i+1);
}
terminals += ';\n\n';
let resultado = code +  terminals + Globales + Funciones + Main;
console.log(resultado)