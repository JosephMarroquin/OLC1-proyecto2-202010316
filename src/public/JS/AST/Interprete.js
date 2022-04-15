class Interprete{
    constructor(){

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
        let txtDefault;
        if(raiz===undefined || raiz===null)return;

        switch(raiz.tag){
            case "RAIZ":
                raiz.childs.forEach(hijo=> codigo+=this.interpretar(hijo))
                return codigo;
            
            case "SENTENCIAS":
                raiz.childs.forEach(hijo=> codigo+=this.interpretar(hijo) )
                return codigo;

            case "DECLARACION":
                raiz.childs[0].childs.forEach(hijo=>{
                    if(TS.getInstance().obtener(hijo.value)==null){
                        if(raiz.childs[1]=="int"){
                            simbolo= new Simbolo(hijo.value,"integer",0);
                        }
                        else if(raiz.childs[1]=="double"){
                            simbolo= new Simbolo(hijo.value,"double","0.0");
                        }
                        else if(raiz.childs[1]=="boolean"){
                            simbolo= new Simbolo(hijo.value,"boolean",true);
                        }
                        else if(raiz.childs[1]=="string"){
                            simbolo= new Simbolo(hijo.value,"string","");
                        }
                        else if(raiz.childs[1]=="char"){
                            simbolo= new Simbolo(hijo.value,"char",'\u0000');
                        }
                        TS.getInstance().insertar(simbolo)
                    }else{
                        L_Error.getInstance().insertar(new N_Error("Semantico","Ya se declaro la variable anteriormente",raiz.childs[1].fila,raiz.childs[1].columna));
                    }  
                })
                break;
            case "ASIGNACION":
                raiz.childs[0].childs.forEach(hijo=>{
                    simbolo=TS.getInstance().obtener(hijo.value);
                    if(simbolo.tipo=="integer"){
                        op = new Operador()
                        res = op.ejecutar(raiz.childs[1])
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
                    else if(simbolo.tipo=="boolean"){
                        op = new Operador()
                        res = op.ejecutar(raiz.childs[1])
                        if(res.tipo=="boolean"){
                            simbolo.tipo=res.tipo;
                            simbolo.valor=res.valor;
                            TS.getInstance().modificar(simbolo)
                        }else{
                            L_Error.getInstance().insertar(new N_Error("Semantico","El valor asignado no corresponde a un boolean",raiz.childs[1].fila,raiz.childs[1].columna));
                            simbolo.valor="Error Semantico"+" El valor asignado no corresponde a un boolean "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                        }
                    }
                    else if(simbolo.tipo=="string"){
                        op = new Operador()
                        res = op.ejecutar(raiz.childs[1])
                        if(res.tipo=="string"){
                            simbolo.tipo=res.tipo;
                            simbolo.valor=res.valor;
                            TS.getInstance().modificar(simbolo)
                        }else{
                            L_Error.getInstance().insertar(new N_Error("Semantico","El valor asignado no corresponde a un string",raiz.childs[1].fila,raiz.childs[1].columna));
                            simbolo.valor="Error Semantico"+" El valor asignado no corresponde a un string "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                        }
                    }
                    else if(simbolo.tipo=="char"){
                        op = new Operador()
                        res = op.ejecutar(raiz.childs[1])
                        if(res.tipo=="char"){
                            simbolo.tipo=res.tipo;
                            simbolo.valor=res.valor;
                            TS.getInstance().modificar(simbolo)
                        }else{
                            L_Error.getInstance().insertar(new N_Error("Semantico","El valor asignado no corresponde a un char",raiz.childs[1].fila,raiz.childs[1].columna));
                            simbolo.valor="Error Semantico"+" El valor asignado no corresponde a un char "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                        }
                    }
                    
                })
                break;

            case "DECLARACIONyASIGNACION":

                //DECLARANDO
                raiz.childs[0].childs.forEach(hijo=>{
                    if(TS.getInstance().obtener(hijo.value)==null){
                        if(raiz.childs[2]=="int"){
                            simbolo= new Simbolo(hijo.value,"integer",0);
                        }
                        else if(raiz.childs[2]=="double"){
                            simbolo= new Simbolo(hijo.value,"double","0.0");
                        }
                        else if(raiz.childs[2]=="boolean"){
                            simbolo= new Simbolo(hijo.value,"boolean",true);
                        }
                        else if(raiz.childs[2]=="string"){
                            simbolo= new Simbolo(hijo.value,"string","");
                        }
                        else if(raiz.childs[2]=="char"){
                            simbolo= new Simbolo(hijo.value,"char",'\u0000');
                        }
                        TS.getInstance().insertar(simbolo)
                    }else{
                        L_Error.getInstance().insertar(new N_Error("Semantico","Ya se declaro la variable anteriormente",raiz.childs[1].fila,raiz.childs[1].columna));
                    }  
                    
                })
                
                //ASIGNANDO
                raiz.childs[0].childs.forEach(hijo=>{
                    simbolo=TS.getInstance().obtener(hijo.value);
                    if(simbolo.tipo=="integer"){
                        op = new Operador()
                        res = op.ejecutar(raiz.childs[1])
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
                    else if(simbolo.tipo=="boolean"){
                        op = new Operador()
                        res = op.ejecutar(raiz.childs[1])
                        if(res.tipo=="boolean"){
                            simbolo.tipo=res.tipo;
                            simbolo.valor=res.valor;
                            TS.getInstance().modificar(simbolo)
                        }else{
                            L_Error.getInstance().insertar(new N_Error("Semantico","El valor asignado no corresponde a un boolean",raiz.childs[1].fila,raiz.childs[1].columna));
                            simbolo.valor="Error Semantico"+" El valor asignado no corresponde a un boolean "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                        }
                    }
                    else if(simbolo.tipo=="string"){
                        op = new Operador()
                        res = op.ejecutar(raiz.childs[1])
                        if(res.tipo=="string"){
                            simbolo.tipo=res.tipo;
                            simbolo.valor=res.valor;
                            TS.getInstance().modificar(simbolo)
                        }else{
                            L_Error.getInstance().insertar(new N_Error("Semantico","El valor asignado no corresponde a un string",raiz.childs[1].fila,raiz.childs[1].columna));
                            simbolo.valor="Error Semantico"+" El valor asignado no corresponde a un string "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                        }
                    }
                    else if(simbolo.tipo=="char"){
                        op = new Operador()
                        res = op.ejecutar(raiz.childs[1])
                        if(res.tipo=="char"){
                            simbolo.tipo=res.tipo;
                            simbolo.valor=res.valor;
                            TS.getInstance().modificar(simbolo)
                        }else{
                            L_Error.getInstance().insertar(new N_Error("Semantico","El valor asignado no corresponde a un char",raiz.childs[1].fila,raiz.childs[1].columna));
                            simbolo.valor="Error Semantico"+" El valor asignado no corresponde a un char "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                        }
                    }
                    
                })
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
                op = new Operador();
                res=op.ejecutar(raiz.childs[0])
            
                if(res.tipo=="boolean"){
                    if(res.valor){
                        raiz.childs[1].childs[0].childs.forEach(nodito => {
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
                                            codigo+=this.interpretar(hh);
                                        });
                                        return codigo;
                                    }
                                }
                            });
                            if(raiz.childs[3]!="elif"){
                                if(codigo==""){
                                    raiz.childs[3].childs[0].childs.forEach(nodito => {
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
                op = new Operador();
                res=op.ejecutar(raiz.childs[0])
                
                if(raiz.childs.length==2){
                    raiz.childs[1].childs.forEach(nodito => {
                        switchcase=op.ejecutar(nodito.childs[0])
                        switch(res.valor){
                            case switchcase.valor:
                                nodito.childs[1].childs.forEach(hh => {
                                    codigo+=this.interpretar(hh);
                                });
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
                                nodito.childs[1].childs.forEach(hh => {
                                    codigo+=this.interpretar(hh);
                                });
                                return codigo;
                        }
                    });
                    switch(res.valor){
                        default:
                            raiz.childs[2].childs.forEach(nodito => {
                                codigo+=this.interpretar(nodito);
                            });
                    }
                    return codigo;
                }
                
            case "DEFAULT":
                op = new Operador();
                res=op.ejecutar(raiz.childs[0])
                switch(res.valor){
                    default:
                        raiz.childs[1].childs.forEach(nodito => {
                            codigo+=this.interpretar(nodito);
                        });
                }
                return codigo;
                

                    
                

            case "DO_WHILE":
                op = new Operador()
                res = op.ejecutar(raiz.childs[1])
            
                do{
                      codigo+=this.interpretar(raiz.childs[0].childs[0])
                      res = op.ejecutar(raiz.childs[1])
                    }while(res.valor)
                    break;
            case "WHILE":
                op = new Operador()
                res = op.ejecutar(raiz.childs[0])
                while(res.valor){
                      codigo+=this.interpretar(raiz.childs[1].childs[0])
                      res = op.ejecutar(raiz.childs[0])
                }
                break;
        }

        return codigo;
    }
}