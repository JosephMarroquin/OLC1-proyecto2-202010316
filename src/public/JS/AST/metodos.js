class Metodos{
    constructor(){

    }

    analizar(raiz){
       return this.interpretar(raiz);
    }

    interpretar(raiz){
        
        let op;
        let res;
        let res2;
        let res3;
        let switchcase;
        let codigo=""
        let simbolo;
        let txtDefault;
        let interprete;
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

            
            
            case "DECLARACION_VECTORES":
    
                    //DECLARANDO
                    raiz.childs[1].childs.forEach(hijo=>{
                        if(TS.getInstance().obtener(hijo.value)==null){
                            if(raiz.childs[0]=="int"){
                                simbolo= new Simbolo(hijo.value,"vector_integer",0);
                            }
                            else if(raiz.childs[0]=="double"){
                                simbolo= new Simbolo(hijo.value,"vector_double",0);
                            }
                            else if(raiz.childs[0]=="boolean"){
                                simbolo= new Simbolo(hijo.value,"vector_boolean",0);
                            }
                            else if(raiz.childs[0]=="string"){
                                simbolo= new Simbolo(hijo.value,"vector_string",0);
                            }
                            else if(raiz.childs[0]=="char"){
                                simbolo= new Simbolo(hijo.value,"vector_char",0);
                            }
                            TS.getInstance().insertar(simbolo)
                        }else{
                            L_Error.getInstance().insertar(new N_Error("Semantico","Ya se declaro la variable anteriormente",raiz.childs[1].fila,raiz.childs[1].columna));
                        }  
                        
                    })
                    
                    //ASIGNANDO
                    raiz.childs[1].childs.forEach(hijo=>{
                        simbolo=TS.getInstance().obtener(hijo.value);
                        if(simbolo.tipo=="vector_integer"){
                            op = new Operador()
                            res = op.ejecutar(raiz.childs[2])
                            if(res.tipo=="integer"){
                                var nuevoArray=new Array(res.valor);
                                for(var i=0; i<nuevoArray.length; i++) {
                                    nuevoArray[i]=0;
                                }
                                simbolo.valor=nuevoArray;
                                TS.getInstance().modificar(simbolo)
                            }
                            else{
                                L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                                codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                            }
                        }
                        else if(simbolo.tipo=="vector_double"){
                            op = new Operador()
                            res = op.ejecutar(raiz.childs[2])
                            if(res.tipo=="integer"){
                                var nuevoArray=new Array(res.valor);
                                for(var i=0; i<nuevoArray.length; i++) {
                                    nuevoArray[i]=0.0;
                                }
                                simbolo.valor=nuevoArray;
                                TS.getInstance().modificar(simbolo)
                            }
                            else{
                                L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                                codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                            }
                        }
                        else if(simbolo.tipo=="vector_boolean"){
                            op = new Operador()
                            res = op.ejecutar(raiz.childs[2])
                            if(res.tipo=="integer"){
                                var nuevoArray=new Array(res.valor);
                                for(var i=0; i<nuevoArray.length; i++) {
                                    nuevoArray[i]=true;
                                }
                                simbolo.valor=nuevoArray;
                                TS.getInstance().modificar(simbolo)
                            }
                            else{
                                L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                                codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                            }
                        }
                        else if(simbolo.tipo=="vector_string"){
                            op = new Operador()
                            res = op.ejecutar(raiz.childs[2])
                            if(res.tipo=="integer"){
                                var nuevoArray=new Array(res.valor);
                                for(var i=0; i<nuevoArray.length; i++) {
                                    nuevoArray[i]="";
                                }
                                simbolo.valor=nuevoArray;
                                TS.getInstance().modificar(simbolo)
                            }
                            else{
                                L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                                codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                            }
                        }
                        else if(simbolo.tipo=="vector_char"){
                            op = new Operador()
                            res = op.ejecutar(raiz.childs[2])
                            if(res.tipo=="integer"){
                                var nuevoArray=new Array(res.valor);
                                for(var i=0; i<nuevoArray.length; i++) {
                                    nuevoArray[i]='\u0000';
                                }
                                simbolo.valor=nuevoArray;
                                TS.getInstance().modificar(simbolo)
                            }
                            else{
                                L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                                codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                            }
                        }
                    })
                    break;
            
            case "DECLARACION_VECTORES2":
    
                    //DECLARANDO
                    raiz.childs[1].childs.forEach(hijo=>{
                        if(TS.getInstance().obtener(hijo.value)==null){
                            if(raiz.childs[0]=="int"){
                                simbolo= new Simbolo(hijo.value,"vector_integer",0);
                            }
                            else if(raiz.childs[0]=="double"){
                                simbolo= new Simbolo(hijo.value,"vector_double",0);
                            }
                            else if(raiz.childs[0]=="boolean"){
                                simbolo= new Simbolo(hijo.value,"vector_boolean",0);
                            }
                            else if(raiz.childs[0]=="string"){
                                simbolo= new Simbolo(hijo.value,"vector_string",0);
                            }
                            else if(raiz.childs[0]=="char"){
                                simbolo= new Simbolo(hijo.value,"vector_char",0);
                            }
                            TS.getInstance().insertar(simbolo)
                        }else{
                            L_Error.getInstance().insertar(new N_Error("Semantico","Ya se declaro la variable anteriormente",raiz.childs[1].fila,raiz.childs[1].columna));
                        }  
                        
                    })
                    
                    //ASIGNANDO
                    raiz.childs[1].childs.forEach(hijo=>{
                        simbolo=TS.getInstance().obtener(hijo.value);
                        if(simbolo.tipo=="vector_integer"){
                            op = new Operador()
                            res = op.ejecutar(raiz.childs[2])
                            res2= op.ejecutar(raiz.childs[3])
                            if(res.tipo=="integer" && res2.tipo=="integer"){
                                var nuevoArray=new Array(res.valor);
                                for(var i=0; i<nuevoArray.length; i++) {
                                    nuevoArray[i]=new Array(res2.valor);
                                }
                                for(var i=0; i<nuevoArray.length; i++) {
                                    for(var j=0; j<nuevoArray[i].length; j++) {
                                        nuevoArray[i][j]=0;
                                    }
                                }
                                simbolo.valor=nuevoArray;
                                TS.getInstance().modificar(simbolo)
                            }
                            else{
                                L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                                codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                            }
                        }
                        else if(simbolo.tipo=="vector_double"){
                            op = new Operador()
                            res = op.ejecutar(raiz.childs[2])
                            res2= op.ejecutar(raiz.childs[3])
                            if(res.tipo=="integer" && res2.tipo=="integer"){
                                var nuevoArray=new Array(res.valor);
                                for(var i=0; i<nuevoArray.length; i++) {
                                    nuevoArray[i]=new Array(res2.valor);
                                }
                                for(var i=0; i<nuevoArray.length; i++) {
                                    for(var j=0; j<nuevoArray[i].length; j++) {
                                        nuevoArray[i][j]=0.0;
                                    }
                                }
                                simbolo.valor=nuevoArray;
                                TS.getInstance().modificar(simbolo)
                            }
                            else{
                                L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                                codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                            }
                        }
                        else if(simbolo.tipo=="vector_boolean"){
                            op = new Operador()
                            res = op.ejecutar(raiz.childs[2])
                            res2= op.ejecutar(raiz.childs[3])
                            if(res.tipo=="integer" && res2.tipo=="integer"){
                                var nuevoArray=new Array(res.valor);
                                for(var i=0; i<nuevoArray.length; i++) {
                                    nuevoArray[i]=new Array(res2.valor);
                                }
                                for(var i=0; i<nuevoArray.length; i++) {
                                    for(var j=0; j<nuevoArray[i].length; j++) {
                                        nuevoArray[i][j]=true;
                                    }
                                }
                                simbolo.valor=nuevoArray;
                                TS.getInstance().modificar(simbolo)
                            }
                            else{
                                L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                                codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                            }
                        }
                        else if(simbolo.tipo=="vector_string"){
                            op = new Operador()
                            res = op.ejecutar(raiz.childs[2])
                            res2= op.ejecutar(raiz.childs[3])
                            if(res.tipo=="integer" && res2.tipo=="integer"){
                                var nuevoArray=new Array(res.valor);
                                for(var i=0; i<nuevoArray.length; i++) {
                                    nuevoArray[i]=new Array(res2.valor);
                                }
                                for(var i=0; i<nuevoArray.length; i++) {
                                    for(var j=0; j<nuevoArray[i].length; j++) {
                                        nuevoArray[i][j]="";
                                    }
                                }
                                simbolo.valor=nuevoArray;
                                TS.getInstance().modificar(simbolo)
                            }
                            else{
                                L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                                codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                            }
                        }
                        else if(simbolo.tipo=="vector_char"){
                            op = new Operador()
                            res = op.ejecutar(raiz.childs[2])
                            res2= op.ejecutar(raiz.childs[3])
                            if(res.tipo=="integer" && res2.tipo=="integer"){
                                var nuevoArray=new Array(res.valor);
                                for(var i=0; i<nuevoArray.length; i++) {
                                    nuevoArray[i]=new Array(res2.valor);
                                }
                                for(var i=0; i<nuevoArray.length; i++) {
                                    for(var j=0; j<nuevoArray[i].length; j++) {
                                        nuevoArray[i][j]='\u0000';
                                    }
                                }
                                simbolo.valor=nuevoArray;
                                TS.getInstance().modificar(simbolo)
                            }
                            else{
                                L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                                codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                            }
                        }
                    })
                    break;
                    
            //DECLARACION VECTORES TIPO 2
            case "DECLARACION_VECTORES_TIPO2":
    
                    //DECLARANDO
                    raiz.childs[1].childs.forEach(hijo=>{
                        if(TS.getInstance().obtener(hijo.value)==null){
                            if(raiz.childs[0]=="int"){
                                simbolo= new Simbolo(hijo.value,"vector_integer",0);
                            }
                            else if(raiz.childs[0]=="double"){
                                simbolo= new Simbolo(hijo.value,"vector_double",0);
                            }
                            else if(raiz.childs[0]=="boolean"){
                                simbolo= new Simbolo(hijo.value,"vector_boolean",0);
                            }
                            else if(raiz.childs[0]=="string"){
                                simbolo= new Simbolo(hijo.value,"vector_string",0);
                            }
                            else if(raiz.childs[0]=="char"){
                                simbolo= new Simbolo(hijo.value,"vector_char",0);
                            }
                            TS.getInstance().insertar(simbolo)
                        }else{
                            L_Error.getInstance().insertar(new N_Error("Semantico","Ya se declaro la variable anteriormente",raiz.childs[1].fila,raiz.childs[1].columna));
                        }  
                        
                    })
                    
                    //ASIGNANDO
                    raiz.childs[1].childs.forEach(hijo=>{
                        simbolo=TS.getInstance().obtener(hijo.value);
                        if(simbolo.tipo=="vector_integer"){
                            op = new Operador()
                            let nuevoArray=[];
                            raiz.childs[2].childs.forEach(nodito => {
                                res = op.ejecutar(nodito)
                                if(res.tipo=="integer"){
                                    nuevoArray.push(res.valor)
                                }
                                else{
                                    L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                                    codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                                }
                            });
                            simbolo.valor=nuevoArray;
                            TS.getInstance().modificar(simbolo)
                        }
                        else if(simbolo.tipo=="vector_double"){
                            op = new Operador()
                            let nuevoArray=[];
                            raiz.childs[2].childs.forEach(nodito => {
                                res = op.ejecutar(nodito)
                                if(res.tipo=="double"){
                                    nuevoArray.push(res.valor)
                                }
                                else{
                                    L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                                    codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                                }
                            });
                            simbolo.valor=nuevoArray;
                            TS.getInstance().modificar(simbolo)
                        }
                        else if(simbolo.tipo=="vector_boolean"){
                            op = new Operador()
                            let nuevoArray=[];
                            raiz.childs[2].childs.forEach(nodito => {
                                res = op.ejecutar(nodito)
                                if(res.tipo=="boolean"){
                                    nuevoArray.push(res.valor)
                                }
                                else{
                                    L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                                    codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                                }
                            });
                            simbolo.valor=nuevoArray;
                            TS.getInstance().modificar(simbolo)
                        }
                        else if(simbolo.tipo=="vector_string"){
                            op = new Operador()
                            let nuevoArray=[];
                            raiz.childs[2].childs.forEach(nodito => {
                                res = op.ejecutar(nodito)
                                if(res.tipo=="string"){
                                    nuevoArray.push(res.valor)
                                }
                                else{
                                    L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                                    codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                                }
                            });
                            simbolo.valor=nuevoArray;
                            TS.getInstance().modificar(simbolo)
                        }
                        else if(simbolo.tipo=="vector_char"){
                            op = new Operador()
                            let nuevoArray=[];
                            raiz.childs[2].childs.forEach(nodito => {
                                res = op.ejecutar(nodito)
                                if(res.tipo=="char"){
                                    nuevoArray.push(res.valor)
                                }
                                else{
                                    L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                                    codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                                }
                            });
                            simbolo.valor=nuevoArray;
                            TS.getInstance().modificar(simbolo)
                        }
                    })
                    break;
            
            //
            case "DECLARACION_VECTORES_TIPO22":
    
                    //DECLARANDO
                    raiz.childs[1].childs.forEach(hijo=>{
                        if(TS.getInstance().obtener(hijo.value)==null){
                            if(raiz.childs[0]=="int"){
                                simbolo= new Simbolo(hijo.value,"vector_integer",0);
                            }
                            else if(raiz.childs[0]=="double"){
                                simbolo= new Simbolo(hijo.value,"vector_double",0);
                            }
                            else if(raiz.childs[0]=="boolean"){
                                simbolo= new Simbolo(hijo.value,"vector_boolean",0);
                            }
                            else if(raiz.childs[0]=="string"){
                                simbolo= new Simbolo(hijo.value,"vector_string",0);
                            }
                            else if(raiz.childs[0]=="char"){
                                simbolo= new Simbolo(hijo.value,"vector_char",0);
                            }
                            TS.getInstance().insertar(simbolo)
                        }else{
                            L_Error.getInstance().insertar(new N_Error("Semantico","Ya se declaro la variable anteriormente",raiz.childs[1].fila,raiz.childs[1].columna));
                        }  
                        
                    })
                    
                    //ASIGNANDO
                    raiz.childs[1].childs.forEach(hijo=>{
                        simbolo=TS.getInstance().obtener(hijo.value);
                        if(simbolo.tipo=="vector_integer"){
                            op = new Operador()
                            let nuevoArray=[];
                            let array2=[];
                            raiz.childs[2].childs.forEach(nodito => {
                                res = op.ejecutar(nodito)
                                if(res.tipo=="integer"){
                                    nuevoArray.push(res.valor)
                                }
                                else{
                                    L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                                    codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                                }
                            });
                            raiz.childs[3].childs.forEach(nodito => {
                                res = op.ejecutar(nodito)
                                if(res.tipo=="integer"){
                                    array2.push(res.valor)
                                }
                                else{
                                    L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                                    codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                                }
                            });
                            var arregloFinal=[];
                            arregloFinal.push(nuevoArray)
                            arregloFinal.push(array2)
                            simbolo.valor=arregloFinal;
                            TS.getInstance().modificar(simbolo)
                        }
                        else if(simbolo.tipo=="vector_double"){
                            op = new Operador()
                            let nuevoArray=[];
                            let array2=[];
                            raiz.childs[2].childs.forEach(nodito => {
                                res = op.ejecutar(nodito)
                                if(res.tipo=="double"){
                                    nuevoArray.push(res.valor)
                                }
                                else{
                                    L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                                    codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                                }
                            });
                            raiz.childs[3].childs.forEach(nodito => {
                                res = op.ejecutar(nodito)
                                if(res.tipo=="double"){
                                    array2.push(res.valor)
                                }
                                else{
                                    L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                                    codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                                }
                            });
                            var arregloFinal=[];
                            arregloFinal.push(nuevoArray)
                            arregloFinal.push(array2)
                            simbolo.valor=arregloFinal;
                            TS.getInstance().modificar(simbolo)
                        }
                        else if(simbolo.tipo=="vector_boolean"){
                            op = new Operador()
                            let nuevoArray=[];
                            let array2=[];
                            raiz.childs[2].childs.forEach(nodito => {
                                res = op.ejecutar(nodito)
                                if(res.tipo=="boolean"){
                                    nuevoArray.push(res.valor)
                                }
                                else{
                                    L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                                    codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                                }
                            });
                            raiz.childs[3].childs.forEach(nodito => {
                                res = op.ejecutar(nodito)
                                if(res.tipo=="boolean"){
                                    array2.push(res.valor)
                                }
                                else{
                                    L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                                    codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                                }
                            });
                            var arregloFinal=[];
                            arregloFinal.push(nuevoArray)
                            arregloFinal.push(array2)
                            simbolo.valor=arregloFinal;
                            TS.getInstance().modificar(simbolo)
                        }
                        else if(simbolo.tipo=="vector_string"){
                            op = new Operador()
                            let nuevoArray=[];
                            let array2=[];
                            raiz.childs[2].childs.forEach(nodito => {
                                res = op.ejecutar(nodito)
                                if(res.tipo=="string"){
                                    nuevoArray.push(res.valor)
                                }
                                else{
                                    L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                                    codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                                }
                            });
                            raiz.childs[3].childs.forEach(nodito => {
                                res = op.ejecutar(nodito)
                                if(res.tipo=="string"){
                                    array2.push(res.valor)
                                }
                                else{
                                    L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                                    codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                                }
                            });
                            var arregloFinal=[];
                            arregloFinal.push(nuevoArray)
                            arregloFinal.push(array2)
                            simbolo.valor=arregloFinal;
                            TS.getInstance().modificar(simbolo)
                        }
                        else if(simbolo.tipo=="vector_char"){
                            op = new Operador()
                            let nuevoArray=[];
                            let array2=[];
                            raiz.childs[2].childs.forEach(nodito => {
                                res = op.ejecutar(nodito)
                                if(res.tipo=="char"){
                                    nuevoArray.push(res.valor)
                                }
                                else{
                                    L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                                    codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                                }
                            });
                            raiz.childs[3].childs.forEach(nodito => {
                                res = op.ejecutar(nodito)
                                if(res.tipo=="char"){
                                    array2.push(res.valor)
                                }
                                else{
                                    L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                                    codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                                }
                            });
                            var arregloFinal=[];
                            arregloFinal.push(nuevoArray)
                            arregloFinal.push(array2)
                            simbolo.valor=arregloFinal;
                            TS.getInstance().modificar(simbolo)
                        }
                    })
                    break;
            
            //MODIFICACION VECTORES
            case "MODIFICA_VECTOR":
                simbolo=TS.getInstance().obtener(raiz.childs[0]);
                if(simbolo.tipo=="vector_integer"){
                    op = new Operador()
                    res = op.ejecutar(raiz.childs[1])
                    res2 = op.ejecutar(raiz.childs[2])
                    if(res.tipo=="integer"){
                        if(res2.tipo=="integer"){
                            simbolo.valor[res.valor]=res2.valor;
                            TS.getInstance().modificar(simbolo)
                        }else{
                            L_Error.getInstance().insertar(new N_Error("Semantico","El valor asignado no corresponde a un entero",raiz.childs[1].fila,raiz.childs[1].columna));
                            simbolo.valor="Error Semantico"+" El valor asignado no corresponde a un entero "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                        }  
                    }else{
                        L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                        codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                    }
                }
                else if(simbolo.tipo=="vector_double"){
                    op = new Operador()
                    res = op.ejecutar(raiz.childs[1])
                    res2 = op.ejecutar(raiz.childs[2])
                    if(res.tipo=="integer"){
                        if(res2.tipo=="double"){
                            simbolo.valor[res.valor]=res2.valor;
                            TS.getInstance().modificar(simbolo)
                        }else{
                            L_Error.getInstance().insertar(new N_Error("Semantico","El valor asignado no corresponde a un double",raiz.childs[1].fila,raiz.childs[1].columna));
                            simbolo.valor="Error Semantico"+" El valor asignado no corresponde a un double "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                        }  
                    }else{
                        L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                        codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                    }
                }
                else if(simbolo.tipo=="vector_boolean"){
                    op = new Operador()
                    res = op.ejecutar(raiz.childs[1])
                    res2 = op.ejecutar(raiz.childs[2])
                    if(res.tipo=="integer"){
                        if(res2.tipo=="boolean"){
                            simbolo.valor[res.valor]=res2.valor;
                            TS.getInstance().modificar(simbolo)
                        }else{
                            L_Error.getInstance().insertar(new N_Error("Semantico","El valor asignado no corresponde a un boolean",raiz.childs[1].fila,raiz.childs[1].columna));
                            simbolo.valor="Error Semantico"+" El valor asignado no corresponde a un boolean "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                        }  
                    }else{
                        L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                        codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                    }
                }
                else if(simbolo.tipo=="vector_string"){
                    op = new Operador()
                    res = op.ejecutar(raiz.childs[1])
                    res2 = op.ejecutar(raiz.childs[2])
                    if(res.tipo=="integer"){
                        if(res2.tipo=="string"){
                            simbolo.valor[res.valor]=res2.valor;
                            TS.getInstance().modificar(simbolo)
                        }else{
                            L_Error.getInstance().insertar(new N_Error("Semantico","El valor asignado no corresponde a un string",raiz.childs[1].fila,raiz.childs[1].columna));
                            simbolo.valor="Error Semantico"+" El valor asignado no corresponde a un string "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                        }  
                    }else{
                        L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                        codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                    }
                }
                else if(simbolo.tipo=="vector_char"){
                    op = new Operador()
                    res = op.ejecutar(raiz.childs[1])
                    res2 = op.ejecutar(raiz.childs[2])
                    if(res.tipo=="integer"){
                        if(res2.tipo=="char"){
                            simbolo.valor[res.valor]=res2.valor;
                            TS.getInstance().modificar(simbolo)
                        }else{
                            L_Error.getInstance().insertar(new N_Error("Semantico","El valor asignado no corresponde a un char",raiz.childs[1].fila,raiz.childs[1].columna));
                            simbolo.valor="Error Semantico"+" El valor asignado no corresponde a un char "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                        }  
                    }else{
                        L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                        codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                    }
                }
                break;
            
            //
            case "MODIFICA_VECTOR2":
                simbolo=TS.getInstance().obtener(raiz.childs[0]);
                if(simbolo.tipo=="vector_integer"){
                    op = new Operador()
                    res = op.ejecutar(raiz.childs[1])
                    res2 = op.ejecutar(raiz.childs[2])
                    res3 = op.ejecutar(raiz.childs[3])
                    if(res.tipo=="integer" && res2.tipo=="integer"){
                        if(res3.tipo=="integer"){
                            simbolo.valor[res.valor][res2.valor]=res3.valor;
                            TS.getInstance().modificar(simbolo)
                        }else{
                            L_Error.getInstance().insertar(new N_Error("Semantico","El valor asignado no corresponde a un entero",raiz.childs[1].fila,raiz.childs[1].columna));
                            simbolo.valor="Error Semantico"+" El valor asignado no corresponde a un entero "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                        }  
                    }else{
                        L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                        codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                    }
                }
                else if(simbolo.tipo=="vector_double"){
                    op = new Operador()
                    res = op.ejecutar(raiz.childs[1])
                    res2 = op.ejecutar(raiz.childs[2])
                    res3 = op.ejecutar(raiz.childs[3])
                    if(res.tipo=="integer" && res2.tipo=="integer"){
                        if(res3.tipo=="double"){
                            simbolo.valor[res.valor][res2.valor]=res3.valor;
                            TS.getInstance().modificar(simbolo)
                        }else{
                            L_Error.getInstance().insertar(new N_Error("Semantico","El valor asignado no corresponde a un double",raiz.childs[1].fila,raiz.childs[1].columna));
                            simbolo.valor="Error Semantico"+" El valor asignado no corresponde a un double "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                        }  
                    }else{
                        L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                        codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                    }
                }
                else if(simbolo.tipo=="vector_boolean"){
                    op = new Operador()
                    res = op.ejecutar(raiz.childs[1])
                    res2 = op.ejecutar(raiz.childs[2])
                    res3 = op.ejecutar(raiz.childs[3])
                    if(res.tipo=="integer" && res2.tipo=="integer"){
                        if(res3.tipo=="boolean"){
                            simbolo.valor[res.valor][res2.valor]=res3.valor;
                            TS.getInstance().modificar(simbolo)
                        }else{
                            L_Error.getInstance().insertar(new N_Error("Semantico","El valor asignado no corresponde a un boolean",raiz.childs[1].fila,raiz.childs[1].columna));
                            simbolo.valor="Error Semantico"+" El valor asignado no corresponde a un boolean "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                        }  
                    }else{
                        L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                        codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                    }
                }
                else if(simbolo.tipo=="vector_string"){
                    op = new Operador()
                    res = op.ejecutar(raiz.childs[1])
                    res2 = op.ejecutar(raiz.childs[2])
                    res3 = op.ejecutar(raiz.childs[3])
                    if(res.tipo=="integer" && res2.tipo=="integer"){
                        if(res3.tipo=="string"){
                            simbolo.valor[res.valor][res2.valor]=res3.valor;
                            TS.getInstance().modificar(simbolo)
                        }else{
                            L_Error.getInstance().insertar(new N_Error("Semantico","El valor asignado no corresponde a un string",raiz.childs[1].fila,raiz.childs[1].columna));
                            simbolo.valor="Error Semantico"+" El valor asignado no corresponde a un string "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                        }  
                    }else{
                        L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                        codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                    }
                }
                else if(simbolo.tipo=="vector_char"){
                    op = new Operador()
                    res = op.ejecutar(raiz.childs[1])
                    res2 = op.ejecutar(raiz.childs[2])
                    res3 = op.ejecutar(raiz.childs[3])
                    if(res.tipo=="integer" && res2.tipo=="integer"){
                        if(res3.tipo=="char"){
                            simbolo.valor[res.valor][res2.valor]=res3.valor;
                            TS.getInstance().modificar(simbolo)
                        }else{
                            L_Error.getInstance().insertar(new N_Error("Semantico","El valor asignado no corresponde a un char",raiz.childs[1].fila,raiz.childs[1].columna));
                            simbolo.valor="Error Semantico"+" El valor asignado no corresponde a un char "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                        }  
                    }else{
                        L_Error.getInstance().insertar(new N_Error("Semantico"," Declaracion incorrecta de un vector ",raiz.childs[1].fila,raiz.childs[1].columna));
                        codigo="Error Semantico"+" Declaracion incorrecta de un vector "+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna
                    }
                }
                break;

            //
            case "METODO_SIN_PA":
                interprete=new Interprete();
                let arregloInstrucciones=[];

                //DECLARANDO
                if(TS.getInstance().obtener(raiz.childs[0])==null){
                    simbolo= new Simbolo(raiz.childs[0],"metodo","");
                    TS.getInstance().insertar(simbolo)
                    raiz.childs[1].childs[0].childs.forEach(nodito => {
                        //interprete.analizaMetodo("si");
                        arregloInstrucciones.push(nodito)
                        //simbolo.valor+=this.interpretar(nodito);
                        //simbolo.valor+=interprete.interpretar(nodito);
                        //interprete.analizaMetodo(null);
                    });
                    simbolo.valor=arregloInstrucciones;
                    TS.getInstance().modificar(simbolo)
                }else{
                    simbolo=TS.getInstance().obtener(raiz.childs[0]);
                    if(simbolo.valor==""){
                        raiz.childs[1].childs[0].childs.forEach(nodito => {
                            //interprete.analizaMetodo("si");
                            arregloInstrucciones.push(nodito)
                            //simbolo.valor+=this.interpretar(nodito);
                            //simbolo.valor+=interprete.interpretar(nodito);
                            //interprete.analizaMetodo(null);
                        });
                        simbolo.valor=arregloInstrucciones;
                        TS.getInstance().modificar(simbolo)
                    }else{
                        L_Error.getInstance().insertar(new N_Error("Semantico","Ya se declaro el metodo anteriormente",raiz.childs[1].fila,raiz.childs[1].columna));
                        codigo="Error Semantico, Ya se declaro el metodo anteriormente"+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna+"\n";
                    }
                    
                }  

                break;
            
                
                
        }

        return codigo;
    }
}