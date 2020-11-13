const tsObject = require('./tsObject');
const Id = require('./Id');

class IdAccess {
    constructor(id,varLast) {
        this.id = id;
        this.varLast = varLast;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        let IdRes = new Id(0,0,this.id);
        IdRes = IdRes.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        //console.log(IdRes);
        //console.log("######################################")
        if(IdRes.isArray) {

            this.varLast.obj = IdRes;
            let r = this.varLast.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
            //console.log(r);
            return r;

        } else if(IdRes.isType) {//puede ser type o una propiedad de arreglo o string

            

        } else if(IdRes.type == 'string') {
            this.varLast.obj = IdRes;
            let r = this.varLast.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
            //console.log(r);
            return r;
        } else {
            console.log("ERROR");
        }
    }
}
module.exports = IdAccess;