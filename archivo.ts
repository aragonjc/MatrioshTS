function factorial(n:number):number{
    //console.trace(n);
    
    if (n==0){
        return 1;
    } else {

        return n * factorial(n-1);
    }
}
let a:number = factorial(3);
console.log(a);