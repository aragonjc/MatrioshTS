const gramatica = require('./gramatica')
const scope = require('./CodigoIntermedio/Scope')

let Scope = new scope(null);

let ast = gramatica.parse('console.log("hola mundo " + true);');

ast.forEach(element => {
   let r = element.translate(Scope); 
   console.log(r.code3d)
});