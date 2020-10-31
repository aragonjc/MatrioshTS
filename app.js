const gramatica = require('./gramatica')
const scope = require('./CodigoIntermedio/Scope')

let Scope = new scope(null);

let ast = gramatica.parse('let a:number = 8;let b:number = 8;if(a > b){console.log("a mayor a b\n");}else if(a < b){console.log("a menor a b\n");}else {console.log("Else\n");}console.log("afuera del if");');
let code = '';
ast.forEach(element => {
   let r = element.translate(Scope); 
   code += r.code3d;
   console.log(r.code3d)
});