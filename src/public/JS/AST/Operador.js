class Operador{
    constructor(){

    }

    ejecutar(raiz){
        var Resultado1=null;
        var Resultado2=null;
        var Resultado=null;
        var ternario1=null;
        var ternario2=null;
        var condicionTernario=null;
        switch (raiz.tag) {
            case "EXP":
                if (raiz.childs.length==3) {
                    Resultado1=this.ejecutar(raiz.childs[0]);
                    Resultado2=this.ejecutar(raiz.childs[2]);
                    var op = raiz.childs[1].value;
                    console.log(op);
                    switch (op) {
                        case "+":
                        case "-":
                        case "*":
                        case "^":
                        case "%":    
                        case "/":
                            return this.aritmetico(Resultado1,Resultado2,raiz.childs[1].fila,raiz.childs[1].columna,op);
                        case "==":
                        case "!=":
                        case ">":
                        case ">=":
                        case "<":
                        case "<=":
                            return this.relacional(Resultado1,Resultado2,raiz.childs[1].fila,raiz.childs[1].columna,op);
                        case "&&":
                        case "||":
                            return this.logicos(Resultado1,Resultado2,raiz.childs[1].fila,raiz.childs[1].columna,op);
                        default:
                            break;  
                    }
                }else if(raiz.childs.length==5){
                    Resultado1=this.ejecutar(raiz.childs[0]);
                    Resultado2=this.ejecutar(raiz.childs[2]);
                    ternario1=this.ejecutar(raiz.childs[3]);
                    ternario2=this.ejecutar(raiz.childs[4]);
                    var op = raiz.childs[1].value;
                    switch (op) {
                        case "==":
                        case "!=":
                        case ">":
                        case ">=":
                        case "<":
                        case "<=":
                            condicionTernario=this.relacional(Resultado1,Resultado2,raiz.childs[1].fila,raiz.childs[1].columna,op);
                    }
                    if(condicionTernario.tipo=="boolean"){
                        if(condicionTernario.valor==true){
                            Resultado= new ResultadoOp();
                            Resultado.tipo=ternario1.tipo;
                            Resultado.valor=ternario1.valor;
                            return Resultado
                        }else if(condicionTernario.valor==false){
                            Resultado= new ResultadoOp();
                            Resultado.tipo=ternario2.tipo;
                            Resultado.valor=ternario2.valor;
                            return Resultado
                        }
                    }
                }
                else if(raiz.childs.length==2){
                   if(raiz.childs[0].value=="!"){
                       Resultado1=this.ejecutar(raiz.childs[1])
                       if(Resultado1.tipo=="boolean"){
                           Resultado= new ResultadoOp();
                           Resultado.tipo="boolean"
                           Resultado.valor=!Resultado1.valor
                           return Resultado
                       }
                   }
                }else{
                    return this.ejecutar(raiz.childs[0]);
                }
                
                break;
            case "id":
                    Resultado = new ResultadoOp();
                    let simbolo= TS.getInstance().obtener(raiz.value);
                    Resultado.tipo=simbolo.tipo;
                    Resultado.valor=simbolo.valor;
                    console.log(raiz);
                    return Resultado;

            case "entero":
                Resultado= new ResultadoOp();
                Resultado.tipo="integer";
                Resultado.valor=parseInt(raiz.value);
                return Resultado
            
            case "decimal":
                Resultado= new ResultadoOp();
                Resultado.tipo="double";
                Resultado.valor=parseFloat(raiz.value);
                return Resultado
                
            case "true":
                    Resultado= new ResultadoOp();
                    Resultado.tipo="boolean";
                    Resultado.valor=true;
                    return Resultado;

                
            case "false":
                    Resultado= new ResultadoOp();
                    Resultado.tipo="boolean";
                    Resultado.valor=false;
                    return Resultado;

            case "string":
                    Resultado= new ResultadoOp();
                    Resultado.tipo="string";
                    Resultado.valor=raiz.value;
                    return Resultado;
            
            case "char":
                    Resultado= new ResultadoOp();
                    Resultado.tipo="char";
                    Resultado.valor=raiz.value;
                    return Resultado;
            
            case "tolower":
                    Resultado= new ResultadoOp();
                    Resultado.tipo="string";
                    Resultado1=this.ejecutar(raiz.value);
                    if(Resultado1.tipo=="string"){
                        Resultado.valor=Resultado1.valor.toLowerCase();
                    }
                    else{
                        L_Error.getInstance().insertar(new N_Error("Semantico","El valor ingresado no es un string ",raiz.fila,raiz.columna));
                        Resultado.tipo="error";
                        Resultado.valor="Semantico"+" El valor ingresado no es un string "+"fila: "+raiz.fila+" columna: "+raiz.columna;
                        return Resultado;
                    }
                    return Resultado;
            
            case "toupper":
                    Resultado= new ResultadoOp();
                    Resultado.tipo="string";
                    Resultado1=this.ejecutar(raiz.value);
                    if(Resultado1.tipo=="string"){
                        Resultado.valor=Resultado1.valor.toUpperCase();
                    }
                    else{
                        L_Error.getInstance().insertar(new N_Error("Semantico","El valor ingresado no es un string ",raiz.fila,raiz.columna));
                        Resultado.tipo="error";
                        Resultado.valor="Semantico"+" El valor ingresado no es un string "+"fila: "+raiz.fila+" columna: "+raiz.columna;
                        return Resultado;
                    }
                    return Resultado;

            case "casteo_entero":
                    Resultado= new ResultadoOp();
                    Resultado1=this.ejecutar(raiz.value)
                    Resultado.tipo="integer";
                    if(Resultado1.tipo=="integer"){
                        Resultado.valor=parseInt(Resultado1.valor);
                    }
                    else if(Resultado1.tipo=="char"){
                        Resultado.valor=parseInt(Resultado1.valor.codePointAt(0));
                    }
                    return Resultado;

            case "casteo_double":
                    Resultado= new ResultadoOp();
                    Resultado1=this.ejecutar(raiz.value)
                    Resultado.tipo="double";
                    if(Resultado1.tipo=="integer"){
                        Resultado.valor=parseFloat(Resultado1.valor);
                    }
                    else if(Resultado1.tipo=="char"){
                        Resultado.valor=parseFloat(Resultado1.valor.codePointAt(0));
                    }
                    return Resultado;
            
            case "casteo_char":
                    Resultado= new ResultadoOp();
                    Resultado1=this.ejecutar(raiz.value)
                    Resultado.tipo="char";
                    if(Resultado1.tipo=="integer"){
                        Resultado.valor=String.fromCodePoint(Resultado1.valor);
                    }
                    return Resultado;
            
            case "casteo_string":
                    Resultado= new ResultadoOp();
                    Resultado1=this.ejecutar(raiz.value)
                    Resultado.tipo="string";
                    if(Resultado1.tipo=="integer"){
                        Resultado.valor=Resultado1.valor.toString();
                    }else if(Resultado1.tipo=="double"){
                        Resultado.valor=Resultado1.valor.toString();
                    }
                    return Resultado;
            
            case "incremento":
                    Resultado= new ResultadoOp();
                    Resultado1=this.ejecutar(raiz.value)
                    if(Resultado1.tipo=="integer"){
                        Resultado.tipo="integer";
                        Resultado.valor=parseInt(Resultado1.valor)+1;
                    }else if(Resultado1.tipo=="double"){
                        Resultado.tipo="double";
                        Resultado.valor=parseFloat(Resultado1.valor)+1;
                    }else if(Resultado1.tipo=="char"){
                        Resultado.tipo="integer";
                        Resultado.valor=Resultado1.valor.charCodeAt(0)+1;
                    }else if(Resultado1.tipo=="boolean"){
                        Resultado.tipo="integer";
                        if(Resultado1.valor==true){
                            Resultado1.valor=1;
                        }else if(Resultado1.valor==false){
                            Resultado1.valor=0;
                        }
                        Resultado.valor=parseInt(Resultado1.valor)+1;
                    }
                    return Resultado;
            
            case "decremento":
                    Resultado= new ResultadoOp();
                    Resultado1=this.ejecutar(raiz.value)
                    if(Resultado1.tipo=="integer"){
                        Resultado.tipo="integer";
                        Resultado.valor=parseInt(Resultado1.valor)-1;
                    }else if(Resultado1.tipo=="double"){
                        Resultado.tipo="double";
                        Resultado.valor=parseFloat(Resultado1.valor)-1;
                    }else if(Resultado1.tipo=="char"){
                        Resultado.tipo="integer";
                        Resultado.valor=Resultado1.valor.charCodeAt(0)-1;
                    }else if(Resultado1.tipo=="boolean"){
                        Resultado.tipo="integer";
                        if(Resultado1.valor==true){
                            Resultado1.valor=1;
                        }else if(Resultado1.valor==false){
                            Resultado1.valor=0;
                        }
                        Resultado.valor=parseInt(Resultado1.valor)-1;
                    }
                    return Resultado;
            
            case "round":
                Resultado= new ResultadoOp();
                Resultado.tipo="double";
                Resultado1=this.ejecutar(raiz.value);
                if(Resultado1.tipo=="double"){
                    Resultado.valor=Math.round(Resultado1.valor);
                }
                else{
                    L_Error.getInstance().insertar(new N_Error("Semantico","El valor ingresado no es un double ",raiz.fila,raiz.columna));
                    Resultado.tipo="error";
                    Resultado.valor="Semantico"+" El valor ingresado no es un double "+"fila: "+raiz.fila+" columna: "+raiz.columna;
                    return Resultado;
                }
                return Resultado;
            
            case "typeof":
                Resultado= new ResultadoOp();
                Resultado.tipo="string";
                Resultado1=this.ejecutar(raiz.value);

                Resultado.valor=Resultado1.tipo;

                return Resultado;
            
            default:
                break;
        }

    }

    logicos(R1,R2,fila,columna,op){
            let tipo1 = R1.tipo;
            let tipo2 = R2.tipo;
            var res = new ResultadoOp();
            if(tipo1=="error"||tipo2=="error"){
                res.tipo="error";
                return res;
            }

            if(tipo1=="boolean" && tipo2=="boolean"){
                res.tipo="boolean"
                switch(op){
                    case "&&":
                        res.valor=R1.valor&&R2.valor
                        return res;
                    case "||":
                        res.valor=R1.valor||R2.valor;
                        return res;
                }
            }


        }

    aritmetico(R1,R2,fila,columna,op){
            
            let tipo1 = R1.tipo;
            let tipo2 = R2.tipo;
            var res = new ResultadoOp();
            if(tipo1=="error"||tipo2=="error"){
                res.tipo="error";
                return res;
            }
            switch(op){
                case "+":
                    switch(tipo1){
                        case "integer":
                            switch(tipo2){
                                case "integer":
                                    res.tipo="integer";
                                    res.valor=parseInt(R1.valor)+parseInt(R2.valor);
                                    return res;
                                case "double":
                                    res.tipo="double";
                                    res.valor=parseFloat(R1.valor)+parseFloat(R2.valor);
                                    return res;
                                case "string":
                                    res.tipo="string";
                                    res.valor=R1.valor.toString()+R2.valor.toString();
                                    return res;
                                case "char":
                                    res.tipo="integer";
                                    R2.valor=R2.valor.charCodeAt(0);
                                    res.valor=parseInt(R1.valor)+parseInt(R2.valor);
                                    return res;
                                case "boolean":
                                    res.tipo="integer";
                                    if(R2.valor==true){
                                        R2.valor=1;
                                    }else if(R2.valor==false){
                                        R2.valor=0;
                                    }
                                    res.valor=parseInt(R1.valor)+parseInt(R2.valor);
                                    return res;
                                default:
                                    L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                    res.tipo="error";
                                    res.valor="Semantico"+" No es posible operacion "+"fila: "+fila+" columna: "+columna;
                                    return res;
                            }
                        case "double":
                            switch(tipo2){
                                case "integer":
                                    res.tipo="double";
                                    res.valor=parseFloat(R1.valor)+parseFloat(R2.valor);
                                    return res;
                                case "double":
                                    res.tipo="double";
                                    res.valor=parseFloat(R1.valor)+parseFloat(R2.valor);
                                    return res;
                                case "boolean":
                                    res.tipo="double";
                                    if(R2.valor==true){
                                        R2.valor=1;
                                    }else if(R2.valor==false){
                                        R2.valor=0;
                                    }
                                    res.valor=parseFloat(R1.valor)+parseFloat(R2.valor);
                                    return res;
                                case "char":
                                    res.tipo="double";
                                    R2.valor=R2.valor.charCodeAt(0);
                                    res.valor=parseFloat(R1.valor)+parseFloat(R2.valor);
                                    return res;
                                case "string":
                                    res.tipo="string";
                                    res.valor=R1.valor.toString()+R2.valor.toString();
                                    return res;
                                default:
                                    L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                    res.tipo="error";
                                    res.valor="Semantico"+" No es posible operacion "+"fila: "+fila+" columna: "+columna;
                                        return res;
                            }
                        case "boolean":
                            switch(tipo2){
                                case "integer":
                                    res.tipo="integer";
                                    if(R1.valor==true){
                                        R1.valor=1;
                                    }else if(R1.valor==false){
                                        R1.valor=0;
                                    }
                                    res.valor=parseInt(R1.valor)+parseInt(R2.valor);
                                    return res;
                                case "double":
                                    res.tipo="double";
                                    if(R1.valor==true){
                                        R1.valor=1;
                                    }else if(R1.valor==false){
                                        R1.valor=0;
                                    }
                                    res.valor=parseFloat(R1.valor)+parseFloat(R2.valor);
                                    return res; 
                                case "string":
                                    res.tipo="string";
                                    res.valor=R1.valor.toString()+R2.valor.toString();
                                    return res;
                                default:
                                    L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                    res.tipo="error";
                                    res.valor="Semantico"+" No es posible operacion "+"fila: "+fila+" columna: "+columna;
                                        return res;
                            }
                        case "char":
                            switch(tipo2){
                                case "integer":
                                    res.tipo="integer";
                                    R1.valor=R1.valor.charCodeAt(0);
                                    res.valor=parseInt(R1.valor)+parseInt(R2.valor);
                                    return res;
                                case "double":
                                    res.tipo="double";
                                    R1.valor=R1.valor.charCodeAt(0);
                                    res.valor=parseFloat(R1.valor)+parseFloat(R2.valor);
                                    return res;
                                case "char":
                                    res.tipo="string";
                                    res.valor=R1.valor.toString()+R2.valor.toString();
                                    return res;
                                case "string":
                                    res.tipo="string";
                                    res.valor=R1.valor.toString()+R2.valor.toString();
                                    return res;
                                default:
                                    L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                    res.tipo="error";
                                    res.valor="Semantico"+" No es posible operacion "+"fila: "+fila+" columna: "+columna;
                                        return res;
                            }
                        case "string":
                            switch(tipo2){
                                case "integer":
                                    res.tipo="string";
                                    res.valor=R1.valor.toString()+R2.valor.toString();
                                    return res;
                                case "double":
                                    res.tipo="string";
                                    res.valor=R1.valor.toString()+R2.valor.toString();
                                    return res;
                                case "boolean":
                                    res.tipo="string";
                                    res.valor=R1.valor.toString()+R2.valor.toString();
                                    return res;
                                case "char":
                                    res.tipo="string";
                                    res.valor=R1.valor.toString()+R2.valor.toString();
                                    return res;
                                case "string":
                                    res.tipo="string";
                                    res.valor=R1.valor.toString()+R2.valor.toString();
                                    return res;
                                default:
                                    L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                    res.tipo="error";
                                    res.valor="Semantico"+" No es posible operacion "+"fila: "+fila+" columna: "+columna;
                                    return res;
                            }
                        default:
                            L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                            res.tipo="error";
                            res.valor="Semantico"+" No es posible operacion "+"fila: "+fila+" columna: "+columna;
                            return res;
                    }
                case "-":
                    switch(tipo1){
                        case "integer":
                            switch(tipo2){
                                    case "integer":
                                        res.tipo="integer";
                                        res.valor=parseInt(R1.valor)-parseInt(R2.valor);
                                        return res;
                                    case "double":
                                        res.tipo="double";
                                        res.valor=parseFloat(R1.valor)-parseFloat(R2.valor);
                                        return res;
                                    case "boolean":
                                        res.tipo="integer";
                                        if(R2.valor==true){
                                            R2.valor=1;
                                        }else if(R2.valor==false){
                                            R2.valor=0;
                                        }
                                        res.valor=parseInt(R1.valor)-parseInt(R2.valor);
                                        return res;
                                    case "char":
                                        res.tipo="integer";
                                        R2.valor=R2.valor.charCodeAt(0);
                                        res.valor=parseInt(R1.valor)-parseInt(R2.valor);
                                        return res;
                                    default:
                                        L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                        res.tipo="error";
                                        res.valor="Semantico"+" No es posible operacion "+"fila: "+fila+" columna: "+columna;
                                        return res;
                                }
                        case "double":
                            switch(tipo2){
                                case "integer":
                                    res.tipo="double";
                                    res.valor=parseFloat(R1.valor)-parseFloat(R2.valor);
                                    return res;
                                case "double":
                                    res.tipo="double";
                                    res.valor=parseFloat(R1.valor)-parseFloat(R2.valor);
                                    return res;
                                case "boolean":
                                    res.tipo="double";
                                    if(R2.valor==true){
                                        R2.valor=1;
                                    }else if(R2.valor==false){
                                        R2.valor=0;
                                    }
                                    res.valor=parseFloat(R1.valor)-parseFloat(R2.valor);
                                    return res;
                                case "char":
                                    res.tipo="double";
                                    R2.valor=R2.valor.charCodeAt(0);
                                    res.valor=parseFloat(R1.valor)-parseFloat(R2.valor);
                                    return res;
                                default:
                                    L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                    res.tipo="error";
                                    res.valor="Semantico"+" No es posible operacion "+"fila: "+fila+" columna: "+columna;
                                    return res;
                                }
                        case "boolean":
                            switch(tipo2){
                                case "integer":
                                    res.tipo="integer";
                                    if(R1.valor==true){
                                        R1.valor=1;
                                    }else if(R1.valor==false){
                                        R1.valor=0;
                                    }
                                    res.valor=parseInt(R1.valor)-parseInt(R2.valor);
                                    return res;
                                case "double":
                                    res.tipo="double";
                                    if(R1.valor==true){
                                        R1.valor=1;
                                    }else if(R1.valor==false){
                                        R1.valor=0;
                                    }
                                    res.valor=parseFloat(R1.valor)-parseFloat(R2.valor);
                                    return res;
                                default:
                                    L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                    res.tipo="error";
                                    res.valor="Semantico"+" No es posible operacion "+"fila: "+fila+" columna: "+columna;
                                    return res;
                                }
                        case "char":
                            switch(tipo2){
                                case "integer":
                                    res.tipo="integer";
                                    R1.valor=R1.valor.charCodeAt(0);
                                    res.valor=parseInt(R1.valor)-parseInt(R2.valor);
                                    return res;
                                case "double":
                                    res.tipo="double";
                                    R1.valor=R1.valor.charCodeAt(0);
                                    res.valor=parseFloat(R1.valor)-parseFloat(R2.valor);
                                    return res;
                                default:
                                    L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                    res.tipo="error";
                                    res.valor="Semantico"+" No es posible operacion "+"fila: "+fila+" columna: "+columna;
                                    return res;
                                }
                        default:
                            L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                            res.tipo="error";
                            res.valor="Semantico"+" No es posible operacion "+"fila: "+fila+" columna: "+columna;
                            return res;
                        }
                case "*":
                        switch(tipo1){
                            case "integer":
                                switch(tipo2){
                                        case "integer":
                                            res.tipo="integer";
                                            res.valor=parseInt(R1.valor)*parseInt(R2.valor);
                                            return res;
                                        case "double":
                                            res.tipo="double";
                                            res.valor=parseFloat(R1.valor)*parseFloat(R2.valor);
                                            return res;
                                        case "char":
                                            res.tipo="integer";
                                            R2.valor=R2.valor.charCodeAt(0);
                                            res.valor=parseInt(R1.valor)*parseInt(R2.valor);
                                            return res;
                                        default:
                                            L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                            res.tipo="error";
                                            res.valor="Semantico"+" No es posible operacion "+"fila: "+fila+" columna: "+columna;
                                            return res;
                                    }
                            case "double":
                                switch(tipo2){
                                    case "integer":
                                        res.tipo="double";
                                        res.valor=parseFloat(R1.valor)*parseFloat(R2.valor);
                                        return res;
                                    case "double":
                                        res.tipo="double";
                                        res.valor=parseFloat(R1.valor)*parseFloat(R2.valor);
                                        return res;
                                    case "char":
                                        res.tipo="double";
                                        R2.valor=R2.valor.charCodeAt(0);
                                        res.valor=parseFloat(R1.valor)*parseFloat(R2.valor);
                                        return res;
                                    default:
                                        L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                        res.tipo="error";
                                        res.valor="Semantico"+" No es posible operacion "+"fila: "+fila+" columna: "+columna;
                                        return res;
                                    }
                            case "char":
                                switch(tipo2){
                                    case "integer":
                                        res.tipo="integer";
                                        R1.valor=R1.valor.charCodeAt(0);
                                        res.valor=parseInt(R1.valor)*parseInt(R2.valor);
                                        return res;
                                    case "double":
                                        res.tipo="double";
                                        R1.valor=R1.valor.charCodeAt(0);
                                        res.valor=parseFloat(R1.valor)*parseFloat(R2.valor);
                                        return res;
                                    default:
                                        L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                        res.tipo="error";
                                        res.valor="Semantico"+" No es posible operacion "+"fila: "+fila+" columna: "+columna;
                                        return res;
                                    }
                            default:
                                L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                res.tipo="error";
                                res.valor="Semantico"+" No es posible operacion "+"fila: "+fila+" columna: "+columna;
                                return res;
                            }
                case "/":
                        switch(tipo1){
                            case "integer":
                                switch(tipo2){
                                        case "integer":
                                            res.tipo="double";
                                            res.valor=parseFloat(R1.valor)/parseFloat(R2.valor);
                                            return res;
                                        case "double":
                                            res.tipo="double";
                                            res.valor=parseFloat(R1.valor)/parseFloat(R2.valor);
                                            return res;
                                        case "char":
                                            res.tipo="double";
                                            R2.valor=R2.valor.charCodeAt(0);
                                            res.valor=parseFloat(R1.valor)/parseFloat(R2.valor);
                                            return res;
                                        default:
                                            L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                            res.tipo="error";
                                            res.valor="Semantico"+" No es posible operacion "+"fila: "+fila+" columna: "+columna;
                                            return res;
                                    }
                            case "double":
                                switch(tipo2){
                                    case "integer":
                                        res.tipo="double";
                                        res.valor=parseFloat(R1.valor)/parseFloat(R2.valor);
                                        return res;
                                    case "double":
                                        res.tipo="double";
                                        res.valor=parseFloat(R1.valor)/parseFloat(R2.valor);
                                        return res;
                                    case "char":
                                        res.tipo="double";
                                        R2.valor=R2.valor.charCodeAt(0);
                                        res.valor=parseFloat(R1.valor)/parseFloat(R2.valor);
                                        return res;
                                    default:
                                        L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                        res.tipo="error";
                                        res.valor="Semantico"+" No es posible operacion "+"fila: "+fila+" columna: "+columna;
                                        return res;
                                    }
                            case "char":
                                switch(tipo2){
                                    case "integer":
                                        res.tipo="double";
                                        R1.valor=R1.valor.charCodeAt(0);
                                        res.valor=parseFloat(R1.valor)/parseFloat(R2.valor);
                                        return res;
                                    case "double":
                                        res.tipo="double";
                                        R1.valor=R1.valor.charCodeAt(0);
                                        res.valor=parseFloat(R1.valor)/parseFloat(R2.valor);
                                        return res;
                                    default:
                                        L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                        res.tipo="error";
                                        res.valor="Semantico"+" No es posible operacion "+"fila: "+fila+" columna: "+columna;
                                        return res;
                                    }
                            default:
                                L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                res.tipo="error";
                                res.valor="Semantico"+" No es posible operacion "+"fila: "+fila+" columna: "+columna;
                                return res;
                            }
                case "^":
                        switch(tipo1){
                            case "integer":
                                switch(tipo2){
                                        case "integer":
                                            res.tipo="integer";
                                            res.valor=Math.pow(parseInt(R1.valor),parseInt(R2.valor));
                                            return res;
                                        case "double":
                                            res.tipo="double";
                                            res.valor=Math.pow(parseFloat(R1.valor),parseFloat(R2.valor));
                                            return res;
                                        default:
                                            L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                            res.tipo="error";
                                            res.valor="Semantico"+" No es posible operacion "+"fila: "+fila+" columna: "+columna;
                                            return res;
                                    }
                            case "double":
                                switch(tipo2){
                                    case "integer":
                                        res.tipo="double";
                                        res.valor=Math.pow(parseFloat(R1.valor),parseFloat(R2.valor));
                                        return res;
                                    case "double":
                                        res.tipo="double";
                                        res.valor=Math.pow(parseFloat(R1.valor),parseFloat(R2.valor));
                                        return res;
                                    default:
                                        L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                        res.tipo="error";
                                        res.valor="Semantico"+" No es posible operacion "+"fila: "+fila+" columna: "+columna;
                                        return res;
                                    }
                            default:
                                L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                res.tipo="error";
                                res.valor="Semantico"+" No es posible operacion "+"fila: "+fila+" columna: "+columna;
                                return res;
                            }
                case "%":
                        switch(tipo1){
                            case "integer":
                                switch(tipo2){
                                        case "integer":
                                            res.tipo="double";
                                            res.valor=parseFloat(R1.valor)%parseFloat(R2.valor);
                                            return res;
                                        case "double":
                                            res.tipo="double";
                                            res.valor=parseFloat(R1.valor)%parseFloat(R2.valor);
                                            return res;
                                        default:
                                            L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                            res.tipo="error";
                                            res.valor="Semantico"+" No es posible operacion "+"fila: "+fila+" columna: "+columna;
                                            return res;
                                    }
                            case "double":
                                switch(tipo2){
                                    case "integer":
                                        res.tipo="double";
                                        res.valor=parseFloat(R1.valor)%parseFloat(R2.valor);
                                        return res;
                                    case "double":
                                        res.tipo="double";
                                        res.valor=parseFloat(R1.valor)%parseFloat(R2.valor);
                                        return res;
                                    default:
                                        L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                        res.tipo="error";
                                        res.valor="Semantico"+" No es posible operacion "+"fila: "+fila+" columna: "+columna;
                                        return res;
                                    }
                            default:
                                L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                res.tipo="error";
                                res.valor="Semantico"+" No es posible operacion "+"fila: "+fila+" columna: "+columna;
                                return res;
                            }


            }
            
        }



    relacional(R1,R2,fila,columna,op){
        let tipo1 = R1.tipo;
        let tipo2 = R2.tipo;
        var res = new ResultadoOp();
        if(tipo1=="error"||tipo2=="error"){
            res.tipo="error";
            return res;
        }
        switch(op){
            case ">":
                switch(tipo1){
                    case "integer":
                    case "double":
                        switch(tipo2){
                            case "integer":
                            case "double":
                                res.tipo="boolean";
                                res.valor=R1.valor>R2.valor;
                                return res;
                            case "char":
                                res.tipo="boolean";
                                R2.valor=R2.valor.charCodeAt(0);
                                res.valor=R1.valor>R2.valor;
                                return res;
                            default:
                                L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                res.tipo="error";
                                res.valor="Semantico"+" No es posible operacion "+"fila: "+fila+" columna: "+columna;
                                return res;
                        }
                    case "char":
                        switch(tipo2){
                            case "integer":
                            case "double":
                                res.tipo="boolean";
                                R1.valor=R1.valor.charCodeAt(0);
                                res.valor=R1.valor>R2.valor;
                                return res;
                            case "char":
                                res.tipo="boolean";
                                R1.valor=R1.valor.charCodeAt(0);
                                R2.valor=R2.valor.charCodeAt(0);
                                res.valor=R1.valor>R2.valor;
                                return res;
                            default:
                                L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                res.tipo="error";
                                res.valor="Semantico"+" No es posible operacion"+"fila: "+fila+" columna: "+columna;
                                return res;
                        }
                    case "boolean":
                            switch(tipo2){
                                case "boolean":
                                    res.tipo="boolean";
                                    if(R1.valor==true){
                                        R1.valor=1;
                                    }else if(R1.valor==false){
                                        R1.valor=0;
                                    }
                                    if(R2.valor==true){
                                        R2.valor=1;
                                    }else if(R2.valor==false){
                                        R2.valor=0;
                                    }
                                    res.valor=R1.valor>R2.valor;
                                    return res;
                                default:
                                    L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                    res.tipo="error";
                                    res.valor="Semantico"+" No es posible operacion"+"fila: "+fila+" columna: "+columna;
                                    return res;
                                }
                    default:
                        L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                        res.tipo="error";
                        res.valor="Semantico"+" No es posible operacion"+"fila: "+fila+" columna: "+columna;
                        return res;
                }
                case "<":
                    switch(tipo1){
                        case "integer":
                        case "double":
                            switch(tipo2){
                                case "integer":
                                case "double":
                                    res.tipo="boolean";
                                    res.valor=R1.valor<R2.valor;
                                    return res;
                                case "char":
                                    res.tipo="boolean";
                                    R2.valor=R2.valor.charCodeAt(0);
                                    res.valor=R1.valor<R2.valor;
                                    return res;
                                default:
                                    L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                    res.tipo="error";
                                    res.valor="Semantico"+" No es posible operacion"+"fila: "+fila+" columna: "+columna;
                                        return res;
                            }
                        case "char":
                            switch(tipo2){
                                case "integer":
                                case "double":
                                    res.tipo="boolean";
                                    R1.valor=R1.valor.charCodeAt(0);
                                    res.valor=R1.valor<R2.valor;
                                    return res;
                                case "char":
                                    res.tipo="boolean";
                                    R1.valor=R1.valor.charCodeAt(0);
                                    R2.valor=R2.valor.charCodeAt(0);
                                    res.valor=R1.valor<R2.valor;
                                    return res;
                                default:
                                    L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                    res.tipo="error";
                                    res.valor="Semantico"+" No es posible operacion"+"fila: "+fila+" columna: "+columna;
                                    return res;
                                }
                        case "boolean":
                            switch(tipo2){
                                case "boolean":
                                    res.tipo="boolean";
                                    if(R1.valor==true){
                                        R1.valor=1;
                                    }else if(R1.valor==false){
                                        R1.valor=0;
                                    }
                                    if(R2.valor==true){
                                        R2.valor=1;
                                    }else if(R2.valor==false){
                                        R2.valor=0;
                                    }
                                    res.valor=R1.valor<R2.valor;
                                    return res;
                                default:
                                    L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                    res.tipo="error";
                                    res.valor="Semantico"+" No es posible operacion"+"fila: "+fila+" columna: "+columna;
                                    return res;
                                }
                        default:
                            L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                            res.tipo="error";
                            res.valor="Semantico"+" No es posible operacion"+"fila: "+fila+" columna: "+columna;
                            return res;
                    }
                case ">=":
                    switch(tipo1){
                        case "integer":
                        case "double":
                            switch(tipo2){
                                case "integer":
                                case "double":
                                    res.tipo="boolean";
                                    res.valor=R1.valor>=R2.valor;
                                    return res;
                                case "char":
                                    res.tipo="boolean";
                                    R2.valor=R2.valor.charCodeAt(0);
                                    res.valor=R1.valor>=R2.valor;
                                    return res;
                                default:
                                    L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                    res.tipo="error";
                                    res.valor="Semantico"+" No es posible operacion"+"fila: "+fila+" columna: "+columna;
                                        return res;
                            }
                        case "char":
                            switch(tipo2){
                                case "integer":
                                case "double":
                                    res.tipo="boolean";
                                    R1.valor=R1.valor.charCodeAt(0);
                                    res.valor=R1.valor>=R2.valor;
                                    return res;
                                case "char":
                                    res.tipo="boolean";
                                    R1.valor=R1.valor.charCodeAt(0);
                                    R2.valor=R2.valor.charCodeAt(0);
                                    res.valor=R1.valor>=R2.valor;
                                    return res;
                                default:
                                    L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                    res.tipo="error";
                                    res.valor="Semantico"+" No es posible operacion"+"fila: "+fila+" columna: "+columna;
                                    return res;
                                }
                        case "boolean":
                            switch(tipo2){
                                case "boolean":
                                    res.tipo="boolean";
                                    if(R1.valor==true){
                                        R1.valor=1;
                                    }else if(R1.valor==false){
                                        R1.valor=0;
                                    }
                                    if(R2.valor==true){
                                        R2.valor=1;
                                    }else if(R2.valor==false){
                                        R2.valor=0;
                                    }
                                    res.valor=R1.valor>=R2.valor;
                                    return res;
                                default:
                                    L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                    res.tipo="error";
                                    res.valor="Semantico"+" No es posible operacion"+"fila: "+fila+" columna: "+columna;
                                    return res;
                                }
                        default:
                            L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                            res.tipo="error";
                            res.valor="Semantico"+" No es posible operacion"+"fila: "+fila+" columna: "+columna;
                            return res;
                    }
                case "<=":
                    switch(tipo1){
                        case "integer":
                        case "double":
                            switch(tipo2){
                                case "integer":
                                case "double":
                                    res.tipo="boolean";
                                    res.valor=R1.valor<=R2.valor;
                                    return res;
                                case "char":
                                    res.tipo="boolean";
                                    R2.valor=R2.valor.charCodeAt(0);
                                    res.valor=R1.valor<=R2.valor;
                                    return res;
                                default:
                                    L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                    res.tipo="error";
                                    res.valor="Semantico"+" No es posible operacion"+"fila: "+fila+" columna: "+columna;
                                        return res;
                            }
                        case "char":
                            switch(tipo2){
                                case "integer":
                                case "double":
                                    res.tipo="boolean";
                                    R1.valor=R1.valor.charCodeAt(0);
                                    res.valor=R1.valor<=R2.valor;
                                    return res;
                                case "char":
                                    res.tipo="boolean";
                                    R1.valor=R1.valor.charCodeAt(0);
                                    R2.valor=R2.valor.charCodeAt(0);
                                    res.valor=R1.valor<=R2.valor;
                                    return res;
                                default:
                                    L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                    res.tipo="error";
                                    res.valor="Semantico"+" No es posible operacion"+"fila: "+fila+" columna: "+columna;
                                    return res;
                                }
                        case "boolean":
                            switch(tipo2){
                                case "boolean":
                                    res.tipo="boolean";
                                    if(R1.valor==true){
                                        R1.valor=1;
                                    }else if(R1.valor==false){
                                        R1.valor=0;
                                    }
                                    if(R2.valor==true){
                                        R2.valor=1;
                                    }else if(R2.valor==false){
                                        R2.valor=0;
                                    }
                                    res.valor=R1.valor<=R2.valor;
                                    return res;
                                default:
                                    L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                    res.tipo="error";
                                    res.valor="Semantico"+" No es posible operacion"+"fila: "+fila+" columna: "+columna;
                                    return res;
                                }
                        default:
                            L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                            res.tipo="error";
                            res.valor="Semantico"+" No es posible operacion"+"fila: "+fila+" columna: "+columna;
                            return res;
                    }
                case "==":
                    switch(tipo1){
                        case "integer":
                        case "double":
                            switch(tipo2){
                                case "integer":
                                case "double":
                                    res.tipo="boolean";
                                    res.valor=R1.valor==R2.valor;
                                    return res;
                                case "char":
                                    res.tipo="boolean";
                                    R2.valor=R2.valor.charCodeAt(0);
                                    res.valor=R1.valor==R2.valor;
                                    return res;
                                default:
                                    L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                    res.tipo="error";
                                    res.valor="Semantico"+" No es posible operacion"+"fila: "+fila+" columna: "+columna;
                                        return res;
                            }
                        case "char":
                            switch(tipo2){
                                case "integer":
                                case "double":
                                    res.tipo="boolean";
                                    R1.valor=R1.valor.charCodeAt(0);
                                    res.valor=R1.valor==R2.valor;
                                    return res;
                                case "char":
                                    res.tipo="boolean";
                                    R1.valor=R1.valor.charCodeAt(0);
                                    R2.valor=R2.valor.charCodeAt(0);
                                    res.valor=R1.valor==R2.valor;
                                    return res;
                                default:
                                    L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                    res.tipo="error";
                                    res.valor="Semantico"+" No es posible operacion"+"fila: "+fila+" columna: "+columna;
                                    return res;
                                }
                        case "boolean":
                            switch(tipo2){
                                case "boolean":
                                    res.tipo="boolean";
                                    res.valor=R1.valor==R2.valor;
                                    return res;
                                default:
                                    L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                    res.tipo="error";
                                    res.valor="Semantico"+" No es posible operacion"+"fila: "+fila+" columna: "+columna;
                                    return res;
                                }
                        case "string":
                            switch(tipo2){
                                case "string":
                                    res.tipo="boolean";
                                    res.valor=R1.valor==R2.valor;
                                    return res;
                                default:
                                    L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                    res.tipo="error";
                                    res.valor="Semantico"+" No es posible operacion"+"fila: "+fila+" columna: "+columna;
                                    return res;
                                }
                        default:
                            L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                            res.tipo="error";
                            res.valor="Semantico"+" No es posible operacion"+"fila: "+fila+" columna: "+columna;
                            return res;
                    }
                case "!=":
                    switch(tipo1){
                        case "integer":
                        case "double":
                            switch(tipo2){
                                case "integer":
                                case "double":
                                    res.tipo="boolean";
                                    res.valor=R1.valor!=R2.valor;
                                    return res;
                                case "char":
                                    res.tipo="boolean";
                                    R2.valor=R2.valor.charCodeAt(0);
                                    res.valor=R1.valor!=R2.valor;
                                    return res;
                                default:
                                    L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                    res.tipo="error";
                                    res.valor="Semantico"+" No es posible operacion"+"fila: "+fila+" columna: "+columna;
                                        return res;
                            }
                        case "char":
                            switch(tipo2){
                                case "integer":
                                case "double":
                                    res.tipo="boolean";
                                    R1.valor=R1.valor.charCodeAt(0);
                                    res.valor=R1.valor!=R2.valor;
                                    return res;
                                case "char":
                                    res.tipo="boolean";
                                    R1.valor=R1.valor.charCodeAt(0);
                                    R2.valor=R2.valor.charCodeAt(0);
                                    res.valor=R1.valor!=R2.valor;
                                    return res;
                                default:
                                    L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                    res.tipo="error";
                                    res.valor="Semantico"+" No es posible operacion"+"fila: "+fila+" columna: "+columna;
                                    return res;
                                }
                        case "boolean":
                            switch(tipo2){
                                case "boolean":
                                    res.tipo="boolean";
                                    res.valor=R1.valor!=R2.valor;
                                    return res;
                                default:
                                    L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                    res.tipo="error";
                                    res.valor="Semantico"+" No es posible operacion"+"fila: "+fila+" columna: "+columna;
                                    return res;
                                }
                        case "string":
                            switch(tipo2){
                                case "string":
                                    res.tipo="boolean";
                                    res.valor=R1.valor!=R2.valor;
                                    return res;
                                default:
                                    L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                                    res.tipo="error";
                                    res.valor="Semantico"+" No es posible operacion"+"fila: "+fila+" columna: "+columna;
                                    return res;
                                }
                        default:
                            L_Error.getInstance().insertar(new N_Error("Semantico","No es posible operacion entre: "+tipo1 +' % '+tipo2,fila,columna));
                            res.tipo="error";
                            res.valor="Semantico"+" No es posible operacion"+"fila: "+fila+" columna: "+columna;
                            return res;
                    }

        }

    }

        verificarrelacional(tipo1,tipo2){
            switch(tipo1){
                case "integer":
                    switch(tipo2){
                        case "integer":
                        case "double":
                        case "char":
                            return true;
                        default:
                            return false;
                    }
                case "double":
                    switch(tipo2){
                        case "integer":
                        case "double":
                        case "char":
                            return true;
                        default: return false;

                    }
                case "char":
                    switch(tipo2){
                        case "integer":
                        case "double":
                        case "char":
                            return true;
                        default: return false;
                    }

            }
        }






    }