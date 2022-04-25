let runable;
let alamcenaContinue;
let almacenaBreak;
let almacenaReturn;
let valorRetorno;
class Interprete{
    constructor(){

    }
    
    analizaMetodo(raiz){
        runable=raiz;
    }

    analizar(raiz){
       return this.interpretar(raiz);
    }

    interpretar(raiz){
        
        let op;
        let res;
        let switchcase;
        let codigo=""
        let simbolo;
        let simbolo2;
        let txtDefault;
        let metodos; 
        if(raiz===undefined || raiz===null)return;

        if(runable=="si"){
        switch(raiz.tag){
            case "RAIZ":
                raiz.childs.forEach(hijo=> codigo+=this.interpretar(hijo))
                return codigo;
            
            case "SENTENCIAS":
                raiz.childs.forEach(hijo=> codigo+=this.interpretar(hijo) )
                return codigo;

            
            
            case "ASIGNACION_INCREMENTO":
                    simbolo=TS.getInstance().obtener(raiz.childs[0].value);
                    if(simbolo.tipo=="integer"){
                        simbolo.valor=parseInt(simbolo.valor)+1;
                        TS.getInstance().modificar(simbolo)
                        
                    }
                    else if(simbolo.tipo=="double"){
                        simbolo.valor=parseFloat(simbolo.valor)+1;
                        TS.getInstance().modificar(simbolo)
                    }
                break;
            
            case "ASIGNACION_DECREMENTO":
                    simbolo=TS.getInstance().obtener(raiz.childs[0].value);
                    if(simbolo.tipo=="integer"){
                        simbolo.valor=parseInt(simbolo.valor)-1;
                        TS.getInstance().modificar(simbolo)
                        
                    }
                    else if(simbolo.tipo=="double"){
                        simbolo.valor=parseFloat(simbolo.valor)-1;
                        TS.getInstance().modificar(simbolo)
                    }
                break;

            case "PRINT":
                op = new Operador();
                res = op.ejecutar(raiz.childs[0]);
                codigo+=res.valor
                return codigo;

            case "PRINTLN":
                op = new Operador();
                res = op.ejecutar(raiz.childs[0]);
                codigo+="\n"+res.valor+"\n"
                return codigo;
            
            case "IF":
                metodos=new Metodos();
                op = new Operador();
                res=op.ejecutar(raiz.childs[0])
            
                if(res.tipo=="boolean"){
                    if(res.valor){
                        raiz.childs[1].childs[0].childs.forEach(nodito => {
                          codigo+=metodos.interpretar(nodito);
                          codigo+=this.interpretar(nodito);
                        });
                        return codigo;
                    }else{
                        if(raiz.childs.length==4){
                            raiz.childs[2].childs.forEach(nodito => {
                                res=op.ejecutar(nodito.childs[0])
                                if(res.tipo=="boolean"){
                                    if(res.valor){
                                        nodito.childs[1].childs.forEach(hh => {
                                            codigo+=metodos.interpretar(nodito);
                                            codigo+=this.interpretar(hh);
                                        });
                                        return codigo;
                                    }
                                }
                            });
                            if(raiz.childs[3]!="elif"){
                                if(codigo==""){
                                    raiz.childs[3].childs[0].childs.forEach(nodito => {
                                        codigo+=metodos.interpretar(nodito);
                                        codigo+=this.interpretar(nodito);
                                      });
                                      return codigo;
                                }else{
                                    return codigo;
                                }
                            }
                            if(raiz.childs[3]=="elif"){
                                return codigo;
                            } 
                        }
                        else if(raiz.childs.length==3){
                            raiz.childs[2].childs[0].childs.forEach(nodito => {
                                codigo+=metodos.interpretar(nodito);
                                codigo+=this.interpretar(nodito);
                              });
                              return codigo;
                        }else{
                            return codigo;
                        }
                    }
                }else{
                    L_Error.getInstance().insertar(new N_Error("Semantico","La instruccion asignada al if no es valida",raiz.childs[0].fila,raiz.childs[0].columna));
                    codigo="Error, la instruccion asignada al if no es valida";
                    return codigo;
                }
            
            //
            case "SWITCH":
                metodos=new Metodos();
                op = new Operador();
                res=op.ejecutar(raiz.childs[0])
                var BreakException = {};
                
                if(raiz.childs.length==2){
                    raiz.childs[1].childs.forEach(nodito => {
                        switchcase=op.ejecutar(nodito.childs[0])
                        switch(res.valor){
                            case switchcase.valor:
                                if(almacenaBreak=="Si"){
                                    almacenaBreak=null;
                                    break;
                                }
                                try{
                                    nodito.childs[1].childs.forEach(hh => {
                                        codigo+=metodos.interpretar(hh);
                                        codigo+=this.interpretar(hh);
                                        if(almacenaBreak=="Si"){
                                            throw BreakException;
                                        }
                                    });
                                }catch (e) {
                                    if (e !== BreakException) throw e;
                                  }
                                return codigo;
                        }
                    });
                    return codigo;
                }
                else if(raiz.childs.length==3){
                    raiz.childs[1].childs.forEach(nodito => {
                        switchcase=op.ejecutar(nodito.childs[0])
                        switch(res.valor){
                            case switchcase.valor:
                                if(almacenaBreak=="Si"){
                                    break;
                                }
                                try{
                                    nodito.childs[1].childs.forEach(hh => {
                                        codigo+=metodos.interpretar(hh);
                                        codigo+=this.interpretar(hh);
                                        if(almacenaBreak=="Si"){
                                            throw BreakException;
                                        }
                                    });
                                }catch (e) {
                                    if (e !== BreakException) throw e;
                                  }
                                return codigo;
                        }
                    });
                    switch(res.valor){
                        default:
                            if(almacenaBreak=="Si"){
                                almacenaBreak=null;
                                break;
                            }
                            try{
                                raiz.childs[2].childs.forEach(nodito => {
                                    codigo+=metodos.interpretar(nodito);
                                    codigo+=this.interpretar(nodito);
                                    if(almacenaBreak=="Si"){
                                        throw BreakException;
                                    }
                                });
                            }catch (e) {
                                if (e !== BreakException) throw e;
                              }
                    }
                    return codigo;
                }
                
            case "DEFAULT":
                metodos=new Metodos();
                op = new Operador();
                var BreakException = {};
                res=op.ejecutar(raiz.childs[0])
                switch(res.valor){
                    default:
                        if(almacenaBreak=="Si"){
                            almacenaBreak=null;
                            break;
                        }
                        try{
                            raiz.childs[1].childs.forEach(nodito => {
                                codigo+=metodos.interpretar(nodito);
                                codigo+=this.interpretar(nodito);
                                if(almacenaBreak=="Si"){
                                    throw BreakException;
                                }
                            });
                        }catch (e) {
                            if (e !== BreakException) throw e;
                          }
                }
                return codigo;
                

            case "DO_WHILE":
                metodos=new Metodos();
                op = new Operador()
                res = op.ejecutar(raiz.childs[1])
                var BreakException = {};
            
                do{
                    if(alamcenaContinue=="Si"){
                        alamcenaContinue=null;
                        continue;
                    }
                    else if(almacenaBreak=="Si"){
                        almacenaBreak=null;
                        break;
                    }
                    else if(almacenaReturn=="Si"){
                        almacenaReturn=null;
                        return;
                    }
                    try{
                        raiz.childs[0].childs[0].childs.forEach(hijo=>{
                            codigo+=metodos.interpretar(hijo);  
                            codigo+=this.interpretar(hijo)
                            if(alamcenaContinue=="Si"){
                                throw BreakException;
                            }
                            else if(almacenaBreak=="Si"){
                                throw BreakException;
                            }
                            else if(almacenaReturn=="Si"){
                                throw BreakException;
                            }
                        });
                        
                    }catch (e) {
                        if (e !== BreakException) throw e;
                    }
                    res = op.ejecutar(raiz.childs[1])
                }while(res.valor)
                break;

            case "WHILE":
                metodos=new Metodos();
                op = new Operador()
                res = op.ejecutar(raiz.childs[0])
                var BreakException = {};

                while(res.valor){
                    if(alamcenaContinue=="Si"){
                        alamcenaContinue=null;
                        continue;
                    }
                    else if(almacenaBreak=="Si"){
                        almacenaBreak=null;
                        break;
                    }
                    else if(almacenaReturn=="Si"){
                        almacenaReturn=null;
                        return;
                    }
                    try {
                        raiz.childs[1].childs[0].childs.forEach(hijo=>{
                            codigo+=metodos.interpretar(hijo)
                            codigo+=this.interpretar(hijo)
                            if(alamcenaContinue=="Si"){
                                throw BreakException;
                            }
                            else if(almacenaBreak=="Si"){
                                throw BreakException;
                            }
                            else if(almacenaReturn=="Si"){
                                throw BreakException;
                            }
                        });
                }catch (e) {
                    if (e !== BreakException) throw e;
                  }
                  res = op.ejecutar(raiz.childs[0])

                }

                break;
            
            case "FOR":
                metodos=new Metodos();
                op = new Operador()
                var BreakException = {};
                if(raiz.childs.length==4){
                    //DECLARACION
                    raiz.childs[0].childs[0].childs.forEach(hijo=>{
                        
                            if(raiz.childs[0].childs[1]=="int"){
                                simbolo= new Simbolo(hijo.value,"integer",0);
                                TS.getInstance().insertar(simbolo)
                            }
                            else if(raiz.childs[0].childs[1]=="double"){
                                simbolo= new Simbolo(hijo.value,"double","0.0");
                                TS.getInstance().insertar(simbolo)
                            }
                         
                    })   

                    //CONDICION
                    res = op.ejecutar(raiz.childs[1])

                    //INSTRUCCIONES
                    while(res.valor){
                        if(alamcenaContinue=="Si"){
                            alamcenaContinue=null;
                            continue;
                        }
                        else if(almacenaBreak=="Si"){
                            almacenaBreak=null;
                            break;
                        }
                        else if(almacenaReturn=="Si"){
                            almacenaReturn=null;
                            return;
                        }
                        try{
                            raiz.childs[3].childs[0].childs.forEach(hijo=>{
                                codigo+=metodos.interpretar(hijo)
                                codigo+=this.interpretar(hijo)
                                if(alamcenaContinue=="Si"){
                                    throw BreakException;
                                }
                                else if(almacenaBreak=="Si"){
                                    throw BreakException;
                                }
                                else if(almacenaReturn=="Si"){
                                    throw BreakException;
                                }
                            });
                        }catch (e) {
                            if (e !== BreakException) throw e;
                        }
                        
                        //ACTUALIZACION
                    raiz.childs[2].childs[0].childs.forEach(hijo=>{
                        simbolo=TS.getInstance().obtener(hijo.value);
                        if(simbolo.tipo=="integer"){
                            op = new Operador()
                            res = op.ejecutar(raiz.childs[2].childs[1])
                            if(res.tipo=="integer"){
                                simbolo.tipo=res.tipo;
                                simbolo.valor=res.valor;
                                TS.getInstance().modificar(simbolo)
                            }else{
                                L_Error.getInstance().insertar(new N_Error("Semantico","El valor asignado no corresponde a un entero",raiz.childs[1].fila,raiz.childs[1].columna));
                                simbolo.valor="Error Semantico"+" El valor asignado no corresponde a un entero "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                            }
                        }
                        else if(simbolo.tipo=="double"){
                            op = new Operador()
                            res = op.ejecutar(raiz.childs[1])
                            if(res.tipo=="double"){
                                simbolo.tipo=res.tipo;
                                simbolo.valor=res.valor;
                                TS.getInstance().modificar(simbolo)
                            }else{
                                L_Error.getInstance().insertar(new N_Error("Semantico","El valor asignado no corresponde a un double",raiz.childs[1].fila,raiz.childs[1].columna));
                                simbolo.valor="Error Semantico"+" El valor asignado no corresponde a un double "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                            }
                        }
                    })
                        res = op.ejecutar(raiz.childs[1])
                    }

                }
                if(raiz.childs.length==5){
                    if(raiz.childs[4]=="incremento"){
                        //DECLARACION
                        raiz.childs[0].childs[0].childs.forEach(hijo=>{
                            
                                if(raiz.childs[0].childs[1]=="int"){
                                    simbolo= new Simbolo(hijo.value,"integer",0);
                                    TS.getInstance().insertar(simbolo)
                                }
                                else if(raiz.childs[0].childs[1]=="double"){
                                    simbolo= new Simbolo(hijo.value,"double","0.0");
                                    TS.getInstance().insertar(simbolo)
                                }
                            
                        })
                        //CONDICION
                        res = op.ejecutar(raiz.childs[1])   

                        //INSTRUCCIONES
                        while(res.valor){
                            if(alamcenaContinue=="Si"){
                                alamcenaContinue=null;
                                continue;
                            }
                            else if(almacenaBreak=="Si"){
                                almacenaBreak=null;
                                break;
                            }
                            else if(almacenaReturn=="Si"){
                                almacenaReturn=null;
                                return;
                            }
                            try{
                                raiz.childs[3].childs[0].childs.forEach(hijo=>{
                                    codigo+=metodos.interpretar(hijo)
                                    codigo+=this.interpretar(hijo)
                                    if(alamcenaContinue=="Si"){
                                        throw BreakException;
                                    }
                                    else if(almacenaBreak=="Si"){
                                        throw BreakException;
                                    }
                                    else if(almacenaReturn=="Si"){
                                        throw BreakException;
                                    }
                                });
                            }catch (e) {
                                if (e !== BreakException) throw e;
                            }
                            //ACTUALIZACION
                            simbolo=TS.getInstance().obtener(raiz.childs[2]);
                            if(simbolo.tipo=="integer"){
                                simbolo.valor=parseInt(simbolo.valor)+1;
                                TS.getInstance().modificar(simbolo)
                            }
                            else if(simbolo.tipo=="double"){
                                simbolo.valor=parseFloat(simbolo.valor)+1;
                                TS.getInstance().modificar(simbolo)
                            }
                            res = op.ejecutar(raiz.childs[1])
                        }
                    }
                    else if(raiz.childs[4]=="decremento"){
                        //DECLARACION
                        raiz.childs[0].childs[0].childs.forEach(hijo=>{
                            
                                if(raiz.childs[0].childs[1]=="int"){
                                    simbolo= new Simbolo(hijo.value,"integer",0);
                                    TS.getInstance().insertar(simbolo)
                                }
                                else if(raiz.childs[0].childs[1]=="double"){
                                    simbolo= new Simbolo(hijo.value,"double","0.0");
                                    TS.getInstance().insertar(simbolo)
                                }
                            
                        })
                        //CONDICION
                        res = op.ejecutar(raiz.childs[1])   

                        //INSTRUCCIONES
                        while(res.valor){
                            if(alamcenaContinue=="Si"){
                                alamcenaContinue=null;
                                continue;
                            }
                            else if(almacenaBreak=="Si"){
                                almacenaBreak=null;
                                break;
                            }
                            else if(almacenaReturn=="Si"){
                                almacenaReturn=null;
                                return;
                            }
                            try{
                                raiz.childs[3].childs[0].childs.forEach(hijo=>{
                                    codigo+=metodos.interpretar(hijo)
                                    codigo+=this.interpretar(hijo)
                                    if(alamcenaContinue=="Si"){
                                        throw BreakException;
                                    }
                                    else if(almacenaBreak=="Si"){
                                        throw BreakException;
                                    }
                                    else if(almacenaReturn=="Si"){
                                        throw BreakException;
                                    }
                                });
                            }catch (e) {
                                if (e !== BreakException) throw e;
                            }
                            //ACTUALIZACION
                            simbolo=TS.getInstance().obtener(raiz.childs[2]);
                            if(simbolo.tipo=="integer"){
                                simbolo.valor=parseInt(simbolo.valor)-1;
                                TS.getInstance().modificar(simbolo)
                            }
                            else if(simbolo.tipo=="double"){
                                simbolo.valor=parseFloat(simbolo.valor)-1;
                                TS.getInstance().modificar(simbolo)
                            }
                            res = op.ejecutar(raiz.childs[1])
                        }
                    }
                    else if(raiz.childs[4]=="asigna"){
                        //DECLARACION Y ASIGNACION
                        raiz.childs[0].childs[0].childs.forEach(hijo=>{
                            
                                if(raiz.childs[0].childs[2]=="int"){
                                    simbolo= new Simbolo(hijo.value,"integer",0);
                                    TS.getInstance().insertar(simbolo)
                                }
                                else if(raiz.childs[0].childs[2]=="double"){
                                    simbolo= new Simbolo(hijo.value,"double","0.0");
                                    TS.getInstance().insertar(simbolo)
                                }
                            
                        })

                        raiz.childs[0].childs[0].childs.forEach(hijo=>{
                            simbolo=TS.getInstance().obtener(hijo.value);
                            if(simbolo.tipo=="integer"){
                                op = new Operador()
                                res = op.ejecutar(raiz.childs[0].childs[1])
                                if(res.tipo=="integer"){
                                    simbolo.tipo=res.tipo;
                                    simbolo.valor=res.valor;
                                    TS.getInstance().modificar(simbolo)
                                }else{
                                    L_Error.getInstance().insertar(new N_Error("Semantico","El valor asignado no corresponde a un entero",raiz.childs[1].fila,raiz.childs[1].columna));
                                    simbolo.valor="Error Semantico"+" El valor asignado no corresponde a un entero "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                                }
                            }
                            else if(simbolo.tipo=="double"){
                                op = new Operador()
                                res = op.ejecutar(raiz.childs[0].childs[1])
                                if(res.tipo=="double"){
                                    simbolo.tipo=res.tipo;
                                    simbolo.valor=res.valor;
                                    TS.getInstance().modificar(simbolo)
                                }else{
                                    L_Error.getInstance().insertar(new N_Error("Semantico","El valor asignado no corresponde a un double",raiz.childs[1].fila,raiz.childs[1].columna));
                                    simbolo.valor="Error Semantico"+" El valor asignado no corresponde a un double "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                                }
                            }
                        })

                        //CONDICION
                        res = op.ejecutar(raiz.childs[1])

                        //INSTRUCCIONES
                        while(res.valor){
                            if(alamcenaContinue=="Si"){
                                alamcenaContinue=null;
                                continue;
                            }
                            else if(almacenaBreak=="Si"){
                                almacenaBreak=null;
                                break;
                            }
                            else if(almacenaReturn=="Si"){
                                almacenaReturn=null;
                                return;
                            }
                            try{
                                raiz.childs[3].childs[0].childs.forEach(hijo=>{
                                    codigo+=metodos.interpretar(hijo)
                                    codigo+=this.interpretar(hijo)
                                    if(alamcenaContinue=="Si"){
                                        throw BreakException;
                                    }
                                    else if(almacenaBreak=="Si"){
                                        throw BreakException;
                                    }
                                    else if(almacenaReturn=="Si"){
                                        throw BreakException;
                                    }
                                });
                            }catch (e) {
                                if (e !== BreakException) throw e;
                            }
                            //ACTUALIZACION
                            raiz.childs[2].childs[0].childs.forEach(hijo=>{
                                simbolo=TS.getInstance().obtener(hijo.value);
                                if(simbolo.tipo=="integer"){
                                    op = new Operador()
                                    res = op.ejecutar(raiz.childs[2].childs[1])
                                    if(res.tipo=="integer"){
                                        simbolo.tipo=res.tipo;
                                        simbolo.valor=res.valor;
                                        TS.getInstance().modificar(simbolo)
                                    }else{
                                        L_Error.getInstance().insertar(new N_Error("Semantico","El valor asignado no corresponde a un entero",raiz.childs[1].fila,raiz.childs[1].columna));
                                        simbolo.valor="Error Semantico"+" El valor asignado no corresponde a un entero "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                                    }
                                }
                                else if(simbolo.tipo=="double"){
                                    op = new Operador()
                                    res = op.ejecutar(raiz.childs[1])
                                    if(res.tipo=="double"){
                                        simbolo.tipo=res.tipo;
                                        simbolo.valor=res.valor;
                                        TS.getInstance().modificar(simbolo)
                                    }else{
                                        L_Error.getInstance().insertar(new N_Error("Semantico","El valor asignado no corresponde a un double",raiz.childs[1].fila,raiz.childs[1].columna));
                                        simbolo.valor="Error Semantico"+" El valor asignado no corresponde a un double "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                                    }
                                }
                            })
                            res = op.ejecutar(raiz.childs[1])
                        }
                    }
                    else if(raiz.childs[4]=="asigna_incre"){
                        //DECLARACION Y ASIGNACION
                        raiz.childs[0].childs[0].childs.forEach(hijo=>{
                            
                                if(raiz.childs[0].childs[2]=="int"){
                                    simbolo= new Simbolo(hijo.value,"integer",0);
                                    TS.getInstance().insertar(simbolo)
                                }
                                else if(raiz.childs[0].childs[2]=="double"){
                                    simbolo= new Simbolo(hijo.value,"double","0.0");
                                    TS.getInstance().insertar(simbolo)
                                }
                            
                        })

                        raiz.childs[0].childs[0].childs.forEach(hijo=>{
                            simbolo=TS.getInstance().obtener(hijo.value);
                            if(simbolo.tipo=="integer"){
                                op = new Operador()
                                res = op.ejecutar(raiz.childs[0].childs[1])
                                if(res.tipo=="integer"){
                                    simbolo.tipo=res.tipo;
                                    simbolo.valor=res.valor;
                                    TS.getInstance().modificar(simbolo)
                                }else{
                                    L_Error.getInstance().insertar(new N_Error("Semantico","El valor asignado no corresponde a un entero",raiz.childs[1].fila,raiz.childs[1].columna));
                                    simbolo.valor="Error Semantico"+" El valor asignado no corresponde a un entero "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                                }
                            }
                            else if(simbolo.tipo=="double"){
                                op = new Operador()
                                res = op.ejecutar(raiz.childs[0].childs[1])
                                if(res.tipo=="double"){
                                    simbolo.tipo=res.tipo;
                                    simbolo.valor=res.valor;
                                    TS.getInstance().modificar(simbolo)
                                }else{
                                    L_Error.getInstance().insertar(new N_Error("Semantico","El valor asignado no corresponde a un double",raiz.childs[1].fila,raiz.childs[1].columna));
                                    simbolo.valor="Error Semantico"+" El valor asignado no corresponde a un double "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                                }
                            }
                        })

                        //CONDICION
                        res = op.ejecutar(raiz.childs[1])

                        //INSTRUCCIONES
                        while(res.valor){
                            if(alamcenaContinue=="Si"){
                                alamcenaContinue=null;
                                continue;
                            }
                            else if(almacenaBreak=="Si"){
                                almacenaBreak=null;
                                break;
                            }
                            else if(almacenaReturn=="Si"){
                                almacenaReturn=null;
                                return;
                            }
                            try{
                                raiz.childs[3].childs[0].childs.forEach(hijo=>{
                                    codigo+=metodos.interpretar(hijo)
                                    codigo+=this.interpretar(hijo)
                                    if(alamcenaContinue=="Si"){
                                        throw BreakException;
                                    }
                                    else if(almacenaBreak=="Si"){
                                        throw BreakException;
                                    }
                                    else if(almacenaReturn=="Si"){
                                        throw BreakException;
                                    }
                                });
                            }catch (e) {
                                if (e !== BreakException) throw e;
                            }
                            //ACTUALIZACION
                            simbolo=TS.getInstance().obtener(raiz.childs[2]);
                            if(simbolo.tipo=="integer"){
                                simbolo.valor=parseInt(simbolo.valor)+1;
                                TS.getInstance().modificar(simbolo)
                            }
                            else if(simbolo.tipo=="double"){
                                simbolo.valor=parseFloat(simbolo.valor)+1;
                                TS.getInstance().modificar(simbolo)
                            }
                            res = op.ejecutar(raiz.childs[1])
                        }
                    }
                    else if(raiz.childs[4]=="asigna_decre"){
                        //DECLARACION Y ASIGNACION
                        raiz.childs[0].childs[0].childs.forEach(hijo=>{
                            
                                if(raiz.childs[0].childs[2]=="int"){
                                    simbolo= new Simbolo(hijo.value,"integer",0);
                                    TS.getInstance().insertar(simbolo)
                                }
                                else if(raiz.childs[0].childs[2]=="double"){
                                    simbolo= new Simbolo(hijo.value,"double","0.0");
                                    TS.getInstance().insertar(simbolo)
                                }
                              
                        })

                        raiz.childs[0].childs[0].childs.forEach(hijo=>{
                            simbolo=TS.getInstance().obtener(hijo.value);
                            if(simbolo.tipo=="integer"){
                                op = new Operador()
                                res = op.ejecutar(raiz.childs[0].childs[1])
                                if(res.tipo=="integer"){
                                    simbolo.tipo=res.tipo;
                                    simbolo.valor=res.valor;
                                    TS.getInstance().modificar(simbolo)
                                }else{
                                    L_Error.getInstance().insertar(new N_Error("Semantico","El valor asignado no corresponde a un entero",raiz.childs[1].fila,raiz.childs[1].columna));
                                    simbolo.valor="Error Semantico"+" El valor asignado no corresponde a un entero "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                                }
                            }
                            else if(simbolo.tipo=="double"){
                                op = new Operador()
                                res = op.ejecutar(raiz.childs[0].childs[1])
                                if(res.tipo=="double"){
                                    simbolo.tipo=res.tipo;
                                    simbolo.valor=res.valor;
                                    TS.getInstance().modificar(simbolo)
                                }else{
                                    L_Error.getInstance().insertar(new N_Error("Semantico","El valor asignado no corresponde a un double",raiz.childs[1].fila,raiz.childs[1].columna));
                                    simbolo.valor="Error Semantico"+" El valor asignado no corresponde a un double "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                                }
                            }
                        })

                        //CONDICION
                        res = op.ejecutar(raiz.childs[1])

                        //INSTRUCCIONES
                        while(res.valor){
                            if(alamcenaContinue=="Si"){
                                alamcenaContinue=null;
                                continue;
                            }
                            else if(almacenaBreak=="Si"){
                                almacenaBreak=null;
                                break;
                            }
                            else if(almacenaReturn=="Si"){
                                almacenaReturn=null;
                                return;
                            }
                            try{
                                raiz.childs[3].childs[0].childs.forEach(hijo=>{
                                    codigo+=metodos.interpretar(hijo)
                                    codigo+=this.interpretar(hijo)
                                    if(alamcenaContinue=="Si"){
                                        throw BreakException;
                                    }
                                    else if(almacenaBreak=="Si"){
                                        throw BreakException;
                                    }
                                    else if(almacenaReturn=="Si"){
                                        throw BreakException;
                                    }
                                });
                            }catch (e) {
                                if (e !== BreakException) throw e;
                            }
                            //ACTUALIZACION
                            simbolo=TS.getInstance().obtener(raiz.childs[2]);
                            if(simbolo.tipo=="integer"){
                                simbolo.valor=parseInt(simbolo.valor)-1;
                                TS.getInstance().modificar(simbolo)
                            }
                            else if(simbolo.tipo=="double"){
                                simbolo.valor=parseFloat(simbolo.valor)-1;
                                TS.getInstance().modificar(simbolo)
                            }
                            res = op.ejecutar(raiz.childs[1])
                        }
                    }
                }
                
                break;
            
            //
            
            //
            case "LLAMADA_MSIN_PA":
                metodos=new Metodos();
                var BreakException = {};

                //DECLARANDO
                if(TS.getInstance().obtener(raiz.childs[0])==null){
                    simbolo= new Simbolo(raiz.childs[0],"metodo","");
                    TS.getInstance().insertar(simbolo)
                }else{
                    simbolo=TS.getInstance().obtener(raiz.childs[0]);
                    if(typeof simbolo.valor=='object'){
                        try{
                        simbolo.valor.forEach(ins =>{
                            codigo+=metodos.interpretar(ins);
                            codigo+=this.interpretar(ins);
                            if(almacenaReturn=="Si"){
                                throw BreakException;
                            }
                        });
                    }catch (e) {
                        if (e !== BreakException) throw e;
                      }
                    }else{
                        codigo+=simbolo.valor;
                    }
                    if(almacenaReturn=="Si"){
                        almacenaReturn=null
                        break;
                    }
                    
                                   
                }  

                break;
            
            //
            case "LLAMADA_MCON_PA":
                metodos=new Metodos();
                op= new Operador();
                var BreakException = {};

                //DECLARANDO
                simbolo=TS.getInstance().obtener(raiz.childs[0]);
                if(typeof simbolo.valor=='object'){
                    //ASIGNANDO VALOR A PARAMETROS INICIALES
                    simbolo.parametros.forEach(hh=>{});
                    for(var i=0; i<raiz.childs[1].childs.length; i++){
                        //Llamar a la variable asignada al metodo 
                        simbolo2=TS.getInstance().obtener(simbolo.parametros[i]);
                        res=op.ejecutar(raiz.childs[1].childs[i])
                        if(simbolo2.tipo==res.tipo){
                            simbolo2.valor=res.valor
                            //codigo+=" id "+simbolo2.valor+"\n"
                            //codigo+=" valor "+res.valor+ "\n"
                            TS.getInstance().modificar(simbolo2)
                        }else{
                            L_Error.getInstance().insertar(new N_Error("Semantico"," El valor asignado no corresponde al pedido por el metodo ",raiz.childs[1].fila,raiz.childs[1].columna));
                            codigo="Semantico"+" El valor asignado no corresponde al pedido por el metodo "+" fila "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                            break;
                        }
                    }

                    //INTERPRETO
                    try{
                    simbolo.valor.forEach(ins =>{
                        codigo+=metodos.interpretar(ins);
                        codigo+=this.interpretar(ins);
                        if(almacenaReturn=="Si"){
                            throw BreakException;
                        }
                    });
                }catch (e) {
                        if (e !== BreakException) throw e;
                      }

                    if(almacenaReturn=="Si"){
                        almacenaReturn=null
                        break;
                    }
                    
                }else{
                    codigo+=simbolo.valor;
                }

                break;


            case "BREAK":
                almacenaBreak="Si";
                break;
            
            //

            //
            case "CONTINUE":
                alamcenaContinue="Si"
                break;
            
            //

            case "RETURN":
                almacenaReturn="Si"
                break;
            
            case "RETURN_VALOR":
                op = new Operador();
                res = op.ejecutar(raiz.childs[1]);
                valorRetorno=res;
                break;
                
                
                
        }
    }
    else if(runable==null){
        switch(raiz.tag){
            case "RAIZ":
                raiz.childs.forEach(hijo=> codigo+=this.interpretar(hijo))
                return codigo;
            
            case "SENTENCIAS":
                raiz.childs.forEach(hijo=> codigo+=this.interpretar(hijo) )
                return codigo;

            case "METODO_SIN_RUN":
                metodos=new Metodos();
                var BreakException = {};

                //DECLARANDO
                if(TS.getInstance().obtener(raiz.childs[0])==null){
                    simbolo= new Simbolo(raiz.childs[0],"metodo","");
                    TS.getInstance().insertar(simbolo)
                    try{
                    raiz.childs[1].childs[0].childs.forEach(nodito => {
                        runable="si"
                        simbolo.valor+=metodos.interpretar(nodito);
                        simbolo.valor+=this.interpretar(nodito);
                        runable=null;
                        if(almacenaReturn=="Si"){
                            throw BreakException;
                        }
                    });
                }catch (e) {
                    if (e !== BreakException) throw e;
                  }
                    TS.getInstance().modificar(simbolo)
                    codigo=simbolo.valor
                    if(almacenaReturn=="Si"){
                        almacenaReturn=null
                        break;
                    }
                }else{
                    simbolo=TS.getInstance().obtener(raiz.childs[0]);
                    if(simbolo.valor==""){
                        raiz.childs[1].childs[0].childs.forEach(nodito => {
                            runable="si"
                            simbolo.valor+=metodos.interpretar(nodito);
                            simbolo.valor+=this.interpretar(nodito);
                            runable=null;
                        });
                        TS.getInstance().modificar(simbolo)
                        codigo=simbolo.valor;
                    }else{
                        L_Error.getInstance().insertar(new N_Error("Semantico","Ya se declaro el metodo anteriormente",raiz.childs[1].fila,raiz.childs[1].columna));
                        codigo="Error Semantico, Ya se declaro el metodo anteriormente";
                    }
                    
                }  

                break;
            
            //
            case "LLAMADA_MSIN_RUN":
                metodos=new Metodos();
                var BreakException = {};
                //DECLARANDO
                if(TS.getInstance().obtener(raiz.childs[0])==null){
                    simbolo= new Simbolo(raiz.childs[0],"metodo","");
                    TS.getInstance().insertar(simbolo)
                }else{
                    simbolo=TS.getInstance().obtener(raiz.childs[0]);
                    try{
                    simbolo.valor.forEach(ins =>{
                        runable="si"
                        codigo+=metodos.interpretar(ins);
                        codigo+=this.interpretar(ins);
                        runable=null;
                        if(almacenaReturn=="Si"){
                            throw BreakException;
                        }
                });
            }catch (e) {
                if (e !== BreakException) throw e;
              }
              if(almacenaReturn=="Si"){
                almacenaReturn=null
                break;
            }               
                }  

                break;
            
            //
            case "LLAMADA_MCON_RUN":
                metodos=new Metodos();
                op= new Operador();
                var BreakException = {};

                //DECLARANDO
                simbolo=TS.getInstance().obtener(raiz.childs[0]);
                if(typeof simbolo.valor=='object'){
                    //ASIGNANDO VALOR A PARAMETROS INICIALES
                    simbolo.parametros.forEach(hh=>{});
                    for(var i=0; i<raiz.childs[1].childs.length; i++){
                        //Llamar a la variable asignada al metodo 
                        simbolo2=TS.getInstance().obtener(simbolo.parametros[i]);
                        res=op.ejecutar(raiz.childs[1].childs[i])
                        if(simbolo2.tipo==res.tipo){
                            simbolo2.valor=res.valor
                            //codigo+=" id "+simbolo2.valor+"\n"
                            //codigo+=" valor "+res.valor+ "\n"
                            TS.getInstance().modificar(simbolo2)
                        }else{
                            L_Error.getInstance().insertar(new N_Error("Semantico"," El valor asignado no corresponde al pedido por el metodo ",raiz.childs[1].fila,raiz.childs[1].columna));
                            codigo="Semantico"+" El valor asignado no corresponde al pedido por el metodo "+" fila "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                            break;
                        }
                    }

                    //INTERPRETO
                    try{
                    simbolo.valor.forEach(ins =>{
                        runable="si"
                        codigo+=metodos.interpretar(ins);
                        codigo+=this.interpretar(ins);
                        runable=null;
                        if(almacenaReturn=="Si"){
                            throw BreakException;
                        }
                    });
                }catch (e) {
                    if (e !== BreakException) throw e;
                  }
                  if(almacenaReturn=="Si"){
                    almacenaReturn=null
                    break;
                }
                    
                }

                break;


            //
            case "METODO_CON_RUN":
                metodos=new Metodos();
                var BreakException = {};

                //DECLARANDO
                if(TS.getInstance().obtener(raiz.childs[0])==null){
                    simbolo= new Simbolo(raiz.childs[0],"metodo","","");
                    simbolo.parametros=[]
                    for(var i=0; i<raiz.childs[1].childs.length; i=i+2) {
                        if(TS.getInstance().obtener(raiz.childs[1].childs[i+1])==null){
                            if(raiz.childs[1].childs[i]=="int"){
                                simbolo2= new Simbolo(raiz.childs[1].childs[i+1],"integer",0);
                            }
                            else if(raiz.childs[1].childs[i]=="double"){
                                simbolo2= new Simbolo(raiz.childs[1].childs[i+1],"double","0.0");
                            }
                            else if(raiz.childs[1].childs[i]=="boolean"){
                                simbolo2= new Simbolo(raiz.childs[1].childs[i+1],"boolean",true);
                            }
                            else if(raiz.childs[1].childs[i]=="string"){
                                simbolo2= new Simbolo(raiz.childs[1].childs[i+1],"string","");
                            }
                            else if(raiz.childs[1].childs[i]=="char"){
                                simbolo2= new Simbolo(raiz.childs[1].childs[i+1],"char",'\u0000');
                            }
                            TS.getInstance().insertar(simbolo2)
                            simbolo.parametros.push(simbolo2.nombre);
                        }else{
                            L_Error.getInstance().insertar(new N_Error("Semantico","Ya se declaro la variable anteriormente",raiz.childs[1].fila,raiz.childs[1].columna));
                            codigo="Error Semantico"+" Ya se declaro la variable anteriormente "+" fila "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna;
                        }  
                        //codigo+=" tipo de dato: "+raiz.childs[1].childs[i]+" ";
                        //codigo+=" id "+raiz.childs[1].childs[i+1]+"\n";
                    }
                    TS.getInstance().insertar(simbolo)
                    try{
                    raiz.childs[2].childs[0].childs.forEach(nodito => {
                        runable="si"
                        //interprete.analizaMetodo("si");
                        simbolo.valor+=metodos.interpretar(nodito);
                        simbolo.valor+=this.interpretar(nodito);
                        //interprete.analizaMetodo(null);
                        runable=null;
                        if(almacenaReturn=="Si"){
                            throw BreakException;
                        }
                    });
                }catch (e) {
                    if (e !== BreakException) throw e;
                  }
                    TS.getInstance().modificar(simbolo)
                    codigo=simbolo.valor;
                    TS.getInstance().modificar(simbolo)
                    if(almacenaReturn=="Si"){
                        almacenaReturn=null
                        break;
                    }
                }else{
                     L_Error.getInstance().insertar(new N_Error("Semantico","Ya se declaro el metodo anteriormente",raiz.childs[1].fila,raiz.childs[1].columna));
                     codigo="Error Semantico, Ya se declaro el metodo anteriormente"+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna+"\n";
                }  

                break;
            //
            
        }
    }

        return codigo;
    }
}