const gramatica = require('./gramatica')
const scope = require('./CodigoIntermedio/Scope')

let Scope = new scope(null);

let ast = gramatica.parse('let a:string = "HOLA Mundo";console.log(a);');
let code = '';
ast.forEach(element => {
   let r = element.translate(Scope); 
   code += r.code3d;
   console.log(r.code3d)
});