module.exports =
    class MathController extends require('./Controller') {
        constructor(HttpContext) {
            super(HttpContext);
        }
        get() {
            function isNumeric(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }
            const estValide=(param)=>{
                if(!param) return false;
                if(!isNumeric(param)) return false;
                return true;
            }
            function factorial(n){
                if(n>=0){
                    if(n===0||n===1){
                    return 1;
                    }
                    return n*factorial(n-1);
                }
                else return null;
            }
            function isPrime(value) {
                for(var i = 2; i < value; i++) {
                    if(value % i === 0) {
                        return false;
                    }
                }
                return value > 1;
            }
            function findPrime(n){
                if(n<=15000){
                    let primeNumer = 0;
                    for ( let i=0; i < n; i++){
                        primeNumer++;
                        while (!isPrime(primeNumer)){
                            primeNumer++;
                        }
                    }
                    return primeNumer;
                }
                return null
            }
            const operationUnitaire=(operation,n)=>{
                switch(operation){
                    case '!': return factorial(n);
                    case 'p': return isPrime(n);
                    case 'np': return findPrime(n);
                    default: return null
                }
            }
            const operationBinaire=(operation,x,y)=>{
                switch(operation){
                    case '+': return x+y;
                    case '-': return x-y;
                    case '*': return x*y;
                    case '/': return x/y;
                    case '%': return x%y;
                    default: return
                }
                
            }

            const operators=['+',' ','-','*','/','%','!','p','np'];
            const operatorsBinaire=['+',' ','-','*','/','%'];
            const operatorsUnitaire=['!','p','np'];
            let queryString=this.HttpContext.path.params;
            console.log(this.HttpContext.path.queryString)
            if(this.HttpContext.path.queryString==undefined||this.HttpContext.path.queryString=='?' ){
                const fs=require('fs');
                const filePath='./wwwroot/help/math.html';
                let content = fs.readFileSync(filePath,{encoding:'utf8', flag:'r'});
                this.HttpContext.response.HTML(content);
            }
            else{
                queryString.error=[]
                let op=queryString.op;
                const TEXTE_error=' doit être un nombre';
                if (operators.includes(op)) {
                    if(operatorsBinaire.includes(op)){
                        let x=queryString.x || queryString.X;
                        let y=queryString.y || queryString.Y;
                        if(op==' '){
                            op='+'
                            queryString.op=op;
                        }
                        if(Object.keys(queryString).length==4 /* Les parametres op, x et y avec la sortie error */ && op && x && y){
                            let siErreur=false;
                            
                            if(!estValide(x))
                            {
                                siErreur=true;
                                queryString.error.push("x"+TEXTE_error);
                            }
                            if(!estValide(y))
                            {
                                siErreur=true;
                                queryString.error.push("y"+TEXTE_error);
                            }
                            if(!siErreur)
                            {
                                let reponse=operationBinaire(op,parseFloat(x),parseFloat(y))
                                queryString.value=reponse.toString();
                            }
                        }
                        else
                            queryString.error.push('paramètres acceptés: \'op\', \'x\' , \'y\'');
                    }
                    if(operatorsUnitaire.includes(op)){
                        let n=queryString.n;
                        if(Object.keys(queryString).length==3 /* Les parametres op et n avec la sortie error */  && op && n){
                            let siErreur=false;
                            if(!estValide(n))
                            {
                                siErreur=true;
                                queryString.error.push("n"+TEXTE_error);
                            }
                            if(parseInt(n)!=n)
                            {
                                siErreur=true;
                                queryString.error.push("n doit être un nombre entier");
                            }
                            if(!siErreur)
                            {
                                let reponse=operationUnitaire(op,n);
                                if(reponse==null){
                                    switch(op){
                                        case('!') :queryString.error.push('Le nombre doit être plus grand ou égal à 0'); break;
                                        case('np') :queryString.error.push('Le nombre doit être plus petit ou égal à 15000'); break;
                                    }
                                }
                                else queryString.value=reponse
                            }
                        }
                        else queryString.error.push('paramètres acceptés: \'op\', \'n\'');
                    }
                }
                else{
                    queryString.error.push('Opérateur inconnu!')
                }
                if(queryString.error.length == 0) delete queryString.error;
                let newQueryString={};
                    for (let [key, value] of Object.entries(queryString)){
                        newQueryString[key.toString().toLocaleLowerCase()]=value;
                    }
                    this.HttpContext.response.JSON(newQueryString);
            }
        }
    }