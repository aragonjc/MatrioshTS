
function Node(n,op,left,right){
    let str = "N"+n + "("+op+");";
    if(left != null && left != "") {
        if(Array.isArray(left)) {
            left.forEach(element=>{
                str += "\n";
                str += element.code + "\n";
                str += "N"+n + "-->" + "N" + element.count+";";
            });
        } else {
            str += "\n";
            str += left.code + "\n";
            str += "N"+n + "-->" + "N" + left.count+";";
        }
    }
    if(right != null && right != "") {
        
            str += "\n";
            str += right.code + "\n";
            str += "N"+n + "-->" + "N" + right.count+";";
        
    }
    return {code:str,count:n}
}

function Leaf(n,value){
    return {code:"N"+n + "("+value+");",count:n};
}




module.exports = {
    Leaf:Leaf,
    Node:Node
}