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

let Scope = new scope(null,0,0);
let ast = gramatica.parse(entrada.toString());
let code = '';
code += 'float P = 0;\n';
code += 'float H = 0;\n';
code += 'float Stack[100000];\n';
code += 'float Heap[100000];\n'
let terminals = 'float t1';


ast.forEach(element => {
   let r = element.translate(Scope); 
   code += r.code3d;
   //console.log(r.code3d)
});

for(let i = 1;i<Scope.terminal;i++){
   terminals +=  ',t'+(i+1);
}
terminals += ';\n';
let resultado = terminals + code;
console.log(resultado)