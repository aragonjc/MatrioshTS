let a:number = 8;
console.log(a+'\n');
console.log('\n');
a = 25;
console.log(a+'\n');
console.log('\n');
let b:number = 8;
console.log(b);
console.log('\n');
if(a > b) {
    let hola:string = "hola mundo\n";
    console.log(hola);
    console.log(a + '\n');
    console.log("a mayor a b\n");
} else if(a < b) {
    console.log("a menor a b\n");
}else {
    console.log("Else\n");
}
console.log("afuera del if");