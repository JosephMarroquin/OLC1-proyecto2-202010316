let cont=0;
class Verificacion{
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
        let valorInstruccion=""
        let simbolo;
        let txtDefault;
        let interprete;
        let metodos;
        if(raiz===undefined || raiz===null)return;

        switch(raiz.tag){
            case "RAIZ":
                raiz.childs.forEach(hijo=> codigo+=this.interpretar(hijo))
                return codigo;
            
            case "SENTENCIAS":
                raiz.childs.forEach(hijo=> codigo+=this.interpretar(hijo) )
                return codigo;
            
            
            //
            case "METODO_SIN_PA":
                interprete=new Interprete();
                metodos=new Metodos();

                //DECLARANDO
                if(TS.getInstance().obtener(raiz.childs[0])==null){
                    simbolo= new Simbolo(raiz.childs[0],"metodo","");
                    TS.getInstance().insertar(simbolo)
                    raiz.childs[1].childs[0].childs.forEach(nodito => {
                        interprete.analizaMetodo("si");
                        simbolo.valor+=metodos.interpretar(nodito);
                        simbolo.valor+=interprete.interpretar(nodito);
                        interprete.analizaMetodo(null);
                    });
                    TS.getInstance().modificar(simbolo)
                }else{
                    simbolo=TS.getInstance().obtener(raiz.childs[0]);
                    if(simbolo.valor==""){
                        raiz.childs[1].childs[0].childs.forEach(nodito => {
                            interprete.analizaMetodo("si");
                            simbolo.valor+=metodos.interpretar(nodito);
                            simbolo.valor+=interprete.interpretar(nodito);
                            interprete.analizaMetodo(null);
                        });
                        TS.getInstance().modificar(simbolo)
                    }else{
                        if(cont==0){
                            simbolo=TS.getInstance().obtener(raiz.childs[0]);                            
                            simbolo.valor.forEach(ins =>{
                                    interprete.analizaMetodo("si");
                                    valorInstruccion+=metodos.interpretar(ins);
                                    valorInstruccion+=interprete.interpretar(ins);
                                    interprete.analizaMetodo(null);
                            });
                            simbolo.valor=valorInstruccion;
                            
                            TS.getInstance().modificar(simbolo)
                        }else{
                            L_Error.getInstance().insertar(new N_Error("Semantico","Ya se declaro el metodo anteriormente",raiz.childs[1].fila,raiz.childs[1].columna));
                            codigo="Error Semantico, Ya se declaro el metodo anteriormente"+" fila: "+raiz.childs[1].fila+" columna "+raiz.childs[1].columna+"\n";
                        }
                    }
                    
                }  

                break;
            
                
                
        }

        return codigo;
    }
}