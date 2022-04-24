var L_Error = (function(){
    var instancia;

    class Lista{
        constructor(){
            this.principio=null;
            this.fin=null;
        }
        //Insertar un Error
        insertar(Error){
            if(this.principio==null){
                this.principio=Error;
                this.fin=Error;
                return;
            }
            this.fin.siguiente=Error;
            Error.anterior=this.fin;
            this.fin=Error;

        }

        // TABLA DE ERRORES A HTML
        getErrores(){
            var texto="";

            texto+=`<html><head><title>Reporte de Tabla de Errores</title><style>
            table {
              border-collapse: collapse;
              width: 100%;
            }
            
            th, td {
              text-align: left;
              padding: 8px;
            }
            
            tr:nth-child(even){background-color: #f2f2f2}
            
            th {
              background-color: #4CAF50;
              color: white;
            }
            </style></head><body>
            <h1>Reporte de Errores</h1>
            <table>
            <tr>
                <th>No.</th>
                <th>Tipo de error</th>
                <th>Descripcion</th>
                <th>Linea</th>
                <th>Columna</th>
            </tr>`;
            var cuenta=1;
            var muestra=this.principio;
            while(muestra!=null){
                texto+="<tr>\n";
                texto+="<td>"+cuenta+"</td>\n";
                texto+="<td>"+muestra.tipo+"</td>\n";
                texto+="<td>"+muestra.descripcion+"</td>\n";
                texto+="<td>"+muestra.fila+"</td>\n";
                texto+="<td>"+muestra.columna+"</td>\n";
                texto+="</tr>";
                cuenta++;
                muestra=muestra.siguiente;
            }
            texto+="</table></body></html>";

            return texto;

        }
        
        getErrores2(){
            var texto="";

            var muestra=this.principio;

            while(muestra!=null){
                texto+="ERROR: Tipo:"+muestra.tipo
                +" Descripcion: "+muestra.descripcion
                +" Fila: "+muestra.fila
                +" Columna: "+muestra.columna+" \n";
                muestra=muestra.siguiente;
            }

            return texto;
        }

        reiniciar(){
            this.principio=null;
            this.fin=null;
        }

    }

    function crearInstancia(){
        return new Lista()
    }

    return {
        getInstance:function(){
            if(!instancia){
                instancia=crearInstancia()
            }
            return instancia;
        }
    }

}());