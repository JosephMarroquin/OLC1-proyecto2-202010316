//Definiendo analisis lexico
%lex

%options case-insensitive

%%

\s+             // se ignoran los espacios en blanco
"//".*          // comentarios de simple linea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]   //comentarios multilineas

//Definir las palabras reservadas

"true"          return 'Tok_true'
"false"             return 'Tok_false'
"if"                return 'Tok_if'
"print"             return 'Tok_print' 
"println"           return 'Tok_println' 
"else"              return 'Tok_else'  
"while"             return 'Tok_while' 
"do"                return 'Tok_do'
"tolower"           return 'Tok_toLower'
"toupper"           return 'Tok_toupper'
"toString"          return 'Tok_tostring'
"switch"            return 'Tok_switch'
"case"              return 'Tok_case'
"default"           return 'Tok_default'
"for"               return 'Tok_for'  
"run"               return 'Tok_run'
"round"             return 'Tok_round'
"typeof"            return 'Tok_typeof'
"break"             return 'Tok_break'
"continue"          return 'Tok_continue'
"return"            return 'Tok_return'
"new"               return 'Tok_new'
"length"            return 'Tok_length'
"tochararray"       return 'Tok_tochararray'
"void"              return 'Tok_void'

//Definir tipos de datos

"int"       return 'Tok_TD_int'
"double"    return 'Tok_TD_double'
"boolean"   return 'Tok_TD_boolean'
"char"      return 'Tok_TD_char'
"string"    return 'Tok_TD_string'

//Simbolos

">="                return 'Tok_mayori'
"<="                return 'Tok_menori'
"=="                return 'Tok_igual'
";"                 return 'Tok_pyc'
","                 return 'Tok_coma'
"="                 return 'Tok_asigna1'
"["                 return 'Tok_cor1'
"]"                 return 'Tok_cor2'
"("                 return 'Tok_par1'
")"                 return 'Tok_par2'
"{"                 return 'Tok_llav1'
"}"                 return 'Tok_llav2'
"-"                 return 'Tok_menos'
"!="                return 'Tok_diferente'
"!"                 return 'Tok_not'
"^"                return 'Tok_pot'
"*"                 return 'Tok_por'
"/"                 return 'Tok_div'
"%"                 return 'Tok_mod'
"+"                 return 'Tok_mas'
">"                 return 'Tok_mayor'
"<"                 return 'Tok_menor'
"&&"                 return 'Tok_and'
"||"                 return 'Tok_or'
"?"                  return 'Tok_interrogacion'
":"                  return 'Tok_dospuntos'

//Expresiones regulares

[\"]("\\n"|"\\r"|"\\t"|"\\'"|"\\\""|"\\\\"|[^\"])*[\"]  { yytext = yytext.substr(1,yyleng-2); return 'Tok_string'; }

[\']("\\n"|"\\r"|"\\t"|"\\'"|"\\\""|"\\\\"|[^\'])[\'] { yytext = yytext.substr(1,yyleng-2); return 'Tok_char'; }

([0-9])+(["."])([0-9])+   return 'Tok_numero';

([a-zA-Z_])[a-zA-Z0-9_]* return 'Tok_ID';

[0-9]+                return 'ENTERO';

<<EOF>>				return 'EOF';
.					{ console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
                                          L_Error.getInstance().insertar(new N_Error("Lexico","Caracter: \" "+yytext+"\" no es valido" ,yylloc.first_line,yylloc.first_column));
                                          return null; }

/lex

//Definir el codigo
// Todo codigo javascript, que necesitemos incluir
%{
    function AST_Node(tag,value,fila,columna){
        this.tag=tag;
        this.value=value;
        this.fila=fila;
        this.columna=columna;
        //Vamos a definir que tenga hijos
        this.childs=[]
        this.addChilds=addChilds;
        this.getSon=getSon;
        function addChilds(){
            for(var i =0; i< arguments.length;i++){
                this.childs.push(arguments[i]);
                if(arguments[i]!==null){
                    arguments[i].padre=this;
                }
            }
        }
        function getSon(pos){
            if(pos >this.hijos.length - 1)return null;
            return this.hijos[pos];
        }
    }
%}

// Precedencia de operadores

%right 'Tok_asigna1'
%left  'Tok_or'
%left  'Tok_and'
%left  'Tok_igual' 'Tok_diferente'
%nonassoc  'Tok_mayor' 'Tok_menor' 'Tok_menori' 'Tok_mayori'
%left  'Tok_mas' 'Tok_menos'
%left  'Tok_por' 'Tok_div' 'Tok_mod'
%right 'Tok_pot'
%right 'Tok_not' UMENOS

//Iniciando la gramatica

//Indicamos la produccion inicial

%start S

%%

//$$    $1
S: SENTENCIAS EOF {$$=new AST_Node("RAIZ","RAIZ",this.$first_line,@1.last_column);$$.addChilds($1);return $$} ;


SENTENCIAS: SENTENCIAS SENTENCIA {$1.addChilds($2);$$=$1;}

            | SENTENCIA{$$= new AST_Node("SENTENCIAS","SENTENCIAS",this._$.first_line,@1.last_column);
                      $$.addChilds($1);} ;

SENTENCIA: DECLARACION Tok_pyc{$$=$1}
           |ASIGNACION Tok_pyc{$$=$1}
           |DECLARACIONyASIGNACION Tok_pyc{$$=$1}
           |DECLARACION_VECTORES Tok_pyc{$$=$1}
           |DECLARACION_VECTORES_TIPO2 Tok_pyc{$$=$1}
           |INCREMENTO_DECREMENTO Tok_pyc{$$=$1}
           |MODIFICA_VECTOR Tok_pyc{$$=$1}
           |VECTOR_CHAR Tok_pyc{$$=$1}
           |BLOQUE{$$=$1}
           |IF{$$=$1}
           |WHILE{$$=$1}
           |DO_WHILE Tok_pyc{$$=$1}
           |PRINT{$$=$1}
           |PRINTLN{$$=$1}
           |SWITCH{$$=$1}
           |FOR{$$=$1}
           |METODOS{$$=$1}
           |FUNCIONES{$$=$1}
           |LLAMADAS Tok_pyc{$$=$1}
           |BREAK{$$=$1}
           |CONTINUE{$$=$1}
           |RETURN{$$=$1}
           |error {console.error('Este es un error sintactico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + @1.last_column);
                                          L_Error.getInstance().insertar(new N_Error("sintactico","No se esperaba Caracter: \" "+yytext+"\" ." ,this._$.first_line,@1.last_column));
                                          return null;}
           ;


DECLARACIONyASIGNACION: Tok_TD_int ID_LIST Tok_asigna1 EXP {$$=new AST_Node("DECLARACIONyASIGNACION","DECLARACIONyASIGNACION",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($2,$4,$1);}
                        |Tok_TD_double ID_LIST Tok_asigna1 EXP {$$=new AST_Node("DECLARACIONyASIGNACION","DECLARACIONyASIGNACION",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($2,$4,$1);}
                        |Tok_TD_boolean ID_LIST Tok_asigna1 EXP {$$=new AST_Node("DECLARACIONyASIGNACION","DECLARACIONyASIGNACION",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($2,$4,$1);}
                        |Tok_TD_string ID_LIST Tok_asigna1 EXP {$$=new AST_Node("DECLARACIONyASIGNACION","DECLARACIONyASIGNACION",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($2,$4,$1);}
                        |Tok_TD_char ID_LIST Tok_asigna1 EXP {$$=new AST_Node("DECLARACIONyASIGNACION","DECLARACIONyASIGNACION",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($2,$4,$1);}
;

VECTOR_CHAR:Tok_TD_char ID_LIST Tok_cor1 Tok_cor2 Tok_asigna1 EXP {$$=new AST_Node("VECTOR_CHAR","VECTOR_CHAR",this._$.first_line,@1.last_column); $$.addChilds($2,$6);}
           |Tok_TD_char Tok_cor1 Tok_cor2 ID_LIST Tok_asigna1 EXP {$$=new AST_Node("VECTOR_CHAR","VECTOR_CHAR",this._$.first_line,@1.last_column); $$.addChilds($4,$6);}
;

DECLARACION_VECTORES: Tok_TD_int ID_LIST Tok_cor1 Tok_cor2 Tok_asigna1 Tok_new Tok_TD_int Tok_cor1 EXP Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES","DECLARACION_VECTORES",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$2,$9);}
                    | Tok_TD_double ID_LIST Tok_cor1 Tok_cor2 Tok_asigna1 Tok_new Tok_TD_double Tok_cor1 EXP Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES","DECLARACION_VECTORES",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$2,$9);}
                    | Tok_TD_boolean ID_LIST Tok_cor1 Tok_cor2 Tok_asigna1 Tok_new Tok_TD_boolean Tok_cor1 EXP Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES","DECLARACION_VECTORES",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$2,$9);}
                    | Tok_TD_string ID_LIST Tok_cor1 Tok_cor2 Tok_asigna1 Tok_new Tok_TD_string Tok_cor1 EXP Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES","DECLARACION_VECTORES",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$2,$9);}
                    | Tok_TD_char ID_LIST Tok_cor1 Tok_cor2 Tok_asigna1 Tok_new Tok_TD_char Tok_cor1 EXP Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES","DECLARACION_VECTORES",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$2,$9);}
                    //VECTORES DE DOS DIMENSIONES
                    | Tok_TD_int ID_LIST Tok_cor1 Tok_cor2 Tok_cor1 Tok_cor2 Tok_asigna1 Tok_new Tok_TD_int Tok_cor1 EXP Tok_cor2 Tok_cor1 EXP Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES2","DECLARACION_VECTORES2",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$2,$11,$14);}
                    | Tok_TD_double ID_LIST Tok_cor1 Tok_cor2 Tok_cor1 Tok_cor2 Tok_asigna1 Tok_new Tok_TD_double Tok_cor1 EXP Tok_cor2 Tok_cor1 EXP Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES2","DECLARACION_VECTORES2",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$2,$11,$14);}
                    | Tok_TD_boolean ID_LIST Tok_cor1 Tok_cor2 Tok_cor1 Tok_cor2 Tok_asigna1 Tok_new Tok_TD_boolean Tok_cor1 EXP Tok_cor2 Tok_cor1 EXP Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES2","DECLARACION_VECTORES2",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$2,$11,$14);}
                    | Tok_TD_string ID_LIST Tok_cor1 Tok_cor2 Tok_cor1 Tok_cor2 Tok_asigna1 Tok_new Tok_TD_string Tok_cor1 EXP Tok_cor2 Tok_cor1 EXP Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES2","DECLARACION_VECTORES2",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$2,$11,$14);}
                    | Tok_TD_char ID_LIST Tok_cor1 Tok_cor2 Tok_cor1 Tok_cor2 Tok_asigna1 Tok_new Tok_TD_char Tok_cor1 EXP Tok_cor2 Tok_cor1 EXP Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES2","DECLARACION_VECTORES2",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$2,$11,$14);}
                    //OTRO
                    | Tok_TD_int Tok_cor1 Tok_cor2 ID_LIST Tok_asigna1 Tok_new Tok_TD_int Tok_cor1 EXP Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES","DECLARACION_VECTORES",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$4,$9);}
                    | Tok_TD_double Tok_cor1 Tok_cor2 ID_LIST Tok_asigna1 Tok_new Tok_TD_double Tok_cor1 EXP Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES","DECLARACION_VECTORES",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$4,$9);}
                    | Tok_TD_boolean Tok_cor1 Tok_cor2 ID_LIST Tok_asigna1 Tok_new Tok_TD_boolean Tok_cor1 EXP Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES","DECLARACION_VECTORES",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$4,$9);}
                    | Tok_TD_string Tok_cor1 Tok_cor2 ID_LIST Tok_asigna1 Tok_new Tok_TD_string Tok_cor1 EXP Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES","DECLARACION_VECTORES",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$4,$9);}
                    | Tok_TD_char Tok_cor1 Tok_cor2 ID_LIST Tok_asigna1 Tok_new Tok_TD_char Tok_cor1 EXP Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES","DECLARACION_VECTORES",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$4,$9);}
                    //VECTORES DE DOS DIMENSIONES
                    | Tok_TD_int Tok_cor1 Tok_cor2 Tok_cor1 Tok_cor2 ID_LIST Tok_asigna1 Tok_new Tok_TD_int Tok_cor1 EXP Tok_cor2 Tok_cor1 EXP Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES2","DECLARACION_VECTORES2",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$6,$11,$14);}
                    | Tok_TD_double Tok_cor1 Tok_cor2 Tok_cor1 Tok_cor2 ID_LIST Tok_asigna1 Tok_new Tok_TD_double Tok_cor1 EXP Tok_cor2 Tok_cor1 EXP Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES2","DECLARACION_VECTORES2",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$6,$11,$14);}
                    | Tok_TD_boolean Tok_cor1 Tok_cor2 Tok_cor1 Tok_cor2 ID_LIST Tok_asigna1 Tok_new Tok_TD_boolean Tok_cor1 EXP Tok_cor2 Tok_cor1 EXP Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES2","DECLARACION_VECTORES2",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$6,$11,$14);}
                    | Tok_TD_string Tok_cor1 Tok_cor2 Tok_cor1 Tok_cor2 ID_LIST Tok_asigna1 Tok_new Tok_TD_string Tok_cor1 EXP Tok_cor2 Tok_cor1 EXP Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES2","DECLARACION_VECTORES2",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$6,$11,$14);}
                    | Tok_TD_char Tok_cor1 Tok_cor2 Tok_cor1 Tok_cor2 ID_LIST Tok_asigna1 Tok_new Tok_TD_char Tok_cor1 EXP Tok_cor2 Tok_cor1 EXP Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES2","DECLARACION_VECTORES2",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$6,$11,$14);}
;

DECLARACION_VECTORES_TIPO2: Tok_TD_int ID_LIST Tok_cor1 Tok_cor2 Tok_asigna1 Tok_cor1 VECTOR_LIST Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES_TIPO2","DECLARACION_VECTORES_TIPO2",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$2,$7);}
                          | Tok_TD_double ID_LIST Tok_cor1 Tok_cor2 Tok_asigna1 Tok_cor1 VECTOR_LIST Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES_TIPO2","DECLARACION_VECTORES_TIPO2",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$2,$7);}
                          | Tok_TD_boolean ID_LIST Tok_cor1 Tok_cor2 Tok_asigna1 Tok_cor1 VECTOR_LIST Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES_TIPO2","DECLARACION_VECTORES_TIPO2",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$2,$7);}
                          | Tok_TD_string ID_LIST Tok_cor1 Tok_cor2 Tok_asigna1 Tok_cor1 VECTOR_LIST Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES_TIPO2","DECLARACION_VECTORES_TIPO2",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$2,$7);}
                          | Tok_TD_char ID_LIST Tok_cor1 Tok_cor2 Tok_asigna1 Tok_cor1 VECTOR_LIST Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES_TIPO2","DECLARACION_VECTORES_TIPO2",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$2,$7);}
                          //VECTORES DE DOS DIMENSIONES
                          | Tok_TD_int ID_LIST Tok_cor1 Tok_cor2 Tok_cor1 Tok_cor2 Tok_asigna1 Tok_cor1 Tok_cor1 VECTOR_LIST Tok_cor2 Tok_coma Tok_cor1 VECTOR_LIST Tok_cor2 Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES_TIPO22","DECLARACION_VECTORES_TIPO22",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$2,$10,$14);}
                          | Tok_TD_double ID_LIST Tok_cor1 Tok_cor2 Tok_cor1 Tok_cor2 Tok_asigna1 Tok_cor1 Tok_cor1 VECTOR_LIST Tok_cor2 Tok_coma Tok_cor1 VECTOR_LIST Tok_cor2 Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES_TIPO22","DECLARACION_VECTORES_TIPO22",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$2,$10,$14);}
                          | Tok_TD_boolean ID_LIST Tok_cor1 Tok_cor2 Tok_cor1 Tok_cor2 Tok_asigna1 Tok_cor1 Tok_cor1 VECTOR_LIST Tok_cor2 Tok_coma Tok_cor1 VECTOR_LIST Tok_cor2 Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES_TIPO22","DECLARACION_VECTORES_TIPO22",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$2,$10,$14);}
                          | Tok_TD_string ID_LIST Tok_cor1 Tok_cor2 Tok_cor1 Tok_cor2 Tok_asigna1 Tok_cor1 Tok_cor1 VECTOR_LIST Tok_cor2 Tok_coma Tok_cor1 VECTOR_LIST Tok_cor2 Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES_TIPO22","DECLARACION_VECTORES_TIPO22",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$2,$10,$14);}
                          | Tok_TD_char ID_LIST Tok_cor1 Tok_cor2 Tok_cor1 Tok_cor2 Tok_asigna1 Tok_cor1 Tok_cor1 VECTOR_LIST Tok_cor2 Tok_coma Tok_cor1 VECTOR_LIST Tok_cor2 Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES_TIPO22","DECLARACION_VECTORES_TIPO22",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$2,$10,$14);}
                        //OTRO
                          | Tok_TD_int Tok_cor1 Tok_cor2 ID_LIST Tok_asigna1 Tok_cor1 VECTOR_LIST Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES_TIPO2","DECLARACION_VECTORES_TIPO2",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$4,$7);}
                          | Tok_TD_double Tok_cor1 Tok_cor2 ID_LIST Tok_asigna1 Tok_cor1 VECTOR_LIST Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES_TIPO2","DECLARACION_VECTORES_TIPO2",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$4,$7);}
                          | Tok_TD_boolean Tok_cor1 Tok_cor2 ID_LIST Tok_asigna1 Tok_cor1 VECTOR_LIST Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES_TIPO2","DECLARACION_VECTORES_TIPO2",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$4,$7);}
                          | Tok_TD_string Tok_cor1 Tok_cor2 ID_LIST Tok_asigna1 Tok_cor1 VECTOR_LIST Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES_TIPO2","DECLARACION_VECTORES_TIPO2",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$4,$7);}
                          | Tok_TD_char Tok_cor1 Tok_cor2 ID_LIST Tok_asigna1 Tok_cor1 VECTOR_LIST Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES_TIPO2","DECLARACION_VECTORES_TIPO2",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$4,$7);}
                          //VECTORES DE DOS DIMENSIONES
                          | Tok_TD_int Tok_cor1 Tok_cor2 Tok_cor1 Tok_cor2 ID_LIST Tok_asigna1 Tok_cor1 Tok_cor1 VECTOR_LIST Tok_cor2 Tok_coma Tok_cor1 VECTOR_LIST Tok_cor2 Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES_TIPO22","DECLARACION_VECTORES_TIPO22",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$6,$10,$14);}
                          | Tok_TD_double Tok_cor1 Tok_cor2 Tok_cor1 Tok_cor2 ID_LIST Tok_asigna1 Tok_cor1 Tok_cor1 VECTOR_LIST Tok_cor2 Tok_coma Tok_cor1 VECTOR_LIST Tok_cor2 Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES_TIPO22","DECLARACION_VECTORES_TIPO22",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$6,$10,$14);}
                          | Tok_TD_boolean Tok_cor1 Tok_cor2 Tok_cor1 Tok_cor2 ID_LIST Tok_asigna1 Tok_cor1 Tok_cor1 VECTOR_LIST Tok_cor2 Tok_coma Tok_cor1 VECTOR_LIST Tok_cor2 Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES_TIPO22","DECLARACION_VECTORES_TIPO22",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$6,$10,$14);}
                          | Tok_TD_string Tok_cor1 Tok_cor2 Tok_cor1 Tok_cor2 ID_LIST Tok_asigna1 Tok_cor1 Tok_cor1 VECTOR_LIST Tok_cor2 Tok_coma Tok_cor1 VECTOR_LIST Tok_cor2 Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES_TIPO22","DECLARACION_VECTORES_TIPO22",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$6,$10,$14);}
                          | Tok_TD_char Tok_cor1 Tok_cor2 Tok_cor1 Tok_cor2 ID_LIST Tok_asigna1 Tok_cor1 Tok_cor1 VECTOR_LIST Tok_cor2 Tok_coma Tok_cor1 VECTOR_LIST Tok_cor2 Tok_cor2 {$$=new AST_Node("DECLARACION_VECTORES_TIPO22","DECLARACION_VECTORES_TIPO22",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($1,$6,$10,$14);}
;

VECTOR_LIST: VECTOR_LIST Tok_coma EXP {$1.addChilds($3); $$=$1;}
        | EXP {$$= new AST_Node("VECTOR_LIST","VECTOR_LIST"); $$.addChilds($1)}
        ;

DECLARACION: Tok_TD_int ID_LIST  {$$= new AST_Node("DECLARACION","DECLARACION",this._$.first_line,@1.first_column); $$.addChilds($2,$1)}
            |Tok_TD_double ID_LIST  {$$= new AST_Node("DECLARACION","DECLARACION",this._$.first_line,@1.first_column); $$.addChilds($2,$1)}
            |Tok_TD_boolean ID_LIST  {$$= new AST_Node("DECLARACION","DECLARACION",this._$.first_line,@1.first_column); $$.addChilds($2,$1)}
            |Tok_TD_string ID_LIST  {$$= new AST_Node("DECLARACION","DECLARACION",this._$.first_line,@1.first_column); $$.addChilds($2,$1)}
            |Tok_TD_char ID_LIST  {$$= new AST_Node("DECLARACION","DECLARACION",this._$.first_line,@1.first_column); $$.addChilds($2,$1)}
;

ID_LIST: ID_LIST Tok_coma Tok_ID {$1.addChilds(new AST_Node("ID",$3,this._$.first_line,@3.first_column)); $$=$1;}
        | Tok_ID {$$= new AST_Node("ID_LIST","ID_LIST"); $$.addChilds(new AST_Node("ID",$1,this._$.first_line,@1.first_column))}
        ;
   
ASIGNACION: ID_LIST Tok_asigna1 EXP {$$=new AST_Node("ASIGNACION","ASIGNACION",this._$.first_line,@1.last_column); 
                                            $$.addChilds($1,$3);}
            ;

INCREMENTO_DECREMENTO: Tok_ID Tok_mas Tok_mas {$$=new AST_Node("ASIGNACION_INCREMENTO","ASIGNACION_INCREMENTO",this._$.first_line,@1.last_column); 
                                            $$.addChilds(new AST_Node("ID",$1,this._$.first_line,@1.first_column));}
                      |Tok_ID Tok_menos Tok_menos {$$=new AST_Node("ASIGNACION_DECREMENTO","ASIGNACION_DECREMENTO",this._$.first_line,@1.last_column); 
                                            $$.addChilds(new AST_Node("ID",$1,this._$.first_line,@1.first_column));}
;

BLOQUE: Tok_llav1 SENTENCIAS Tok_llav2{$$= new AST_Node("BLOQUE","BLOQUE",this._$.first_line,@1.last_column); $$.addChilds($2)}
        |Tok_llav1 Tok_llav2{$$= new AST_Node("BLOQUE","BLOQUE",this._$.first_line,@1.last_column);};


elif_list: elif_list elif {$1.addChilds($2);$$=$1}
         | elif {$$=new AST_Node("elif_list","elif_list",this._$.first_line,@1.last_column);$$.addChilds($1);}
;

elif: Tok_else Tok_if Tok_par1 EXP Tok_par2 BLOQUE {$$= new AST_Node("IF","IF",this._$.first_line,@1.last_column);$$.addChilds($4,$6)};

IF: Tok_if Tok_par1 EXP Tok_par2 BLOQUE    {$$= new AST_Node("IF","IF",this._$.first_line,@1.last_column);$$.addChilds($3,$5)}
    |Tok_if Tok_par1 EXP Tok_par2 BLOQUE Tok_else BLOQUE {$$= new AST_Node("IF","IF",this._$.first_line,@1.last_column);$$.addChilds($3,$5,$7)}
    |Tok_if Tok_par1 EXP Tok_par2 BLOQUE elif_list {$$= new AST_Node("IF","IF",this._$.first_line,@1.last_column);$$.addChilds($3,$5,$6,"elif")}
    |Tok_if Tok_par1 EXP Tok_par2 BLOQUE elif_list Tok_else BLOQUE {$$= new AST_Node("IF","IF",this._$.first_line,@1.last_column);$$.addChilds($3,$5,$6,$8)}
    ;

CASE_LIST: CASE_LIST CASE {$1.addChilds($2);$$=$1}
         | CASE {$$=new AST_Node("CASE_LIST","CASE_LIST",this._$.first_line,@1.last_column);$$.addChilds($1);}
;

CASE: Tok_case EXP Tok_dospuntos SENTENCIAS {$$= new AST_Node("CASE","CASE",this._$.first_line,@1.last_column);$$.addChilds($2,$4)}
;

SWITCH: Tok_switch Tok_par1 EXP Tok_par2 Tok_llav1 CASE_LIST Tok_llav2 {$$= new AST_Node("SWITCH","SWITCH",this._$.first_line,@1.last_column);$$.addChilds($3,$6)}
      | Tok_switch Tok_par1 EXP Tok_par2 Tok_llav1 CASE_LIST Tok_default Tok_dospuntos SENTENCIAS Tok_llav2 {$$= new AST_Node("SWITCH","SWITCH",this._$.first_line,@1.last_column);$$.addChilds($3,$6,$9)}
      | Tok_switch Tok_par1 EXP Tok_par2 Tok_llav1 Tok_default Tok_dospuntos SENTENCIAS Tok_llav2 {$$= new AST_Node("DEFAULT","DEFAULT",this._$.first_line,@1.last_column);$$.addChilds($3,$8)}
;

WHILE: Tok_while Tok_par1 EXP Tok_par2 BLOQUE {$$=new AST_Node("WHILE","WHILE",this._$.first_line,@1.last_column); $$.addChilds($3,$5)};


DO_WHILE: Tok_do BLOQUE Tok_while Tok_par1 EXP Tok_par2 {$$=new AST_Node("DO_WHILE","DO_WHILE",this._$.first_line,@1.last_column);$$.addChilds($2,$5)};

FOR: Tok_for Tok_par1 DECLARACION Tok_pyc EXP Tok_pyc ASIGNACION Tok_par2 BLOQUE {$$=new AST_Node("FOR","FOR",this._$.first_line,@1.last_column); $$.addChilds($3,$5,$7,$9)}
   | Tok_for Tok_par1 DECLARACION Tok_pyc EXP Tok_pyc Tok_ID Tok_mas Tok_mas Tok_par2 BLOQUE {$$=new AST_Node("FOR","FOR",this._$.first_line,@1.last_column); $$.addChilds($3,$5,$7,$11,"incremento")}
   | Tok_for Tok_par1 DECLARACION Tok_pyc EXP Tok_pyc Tok_ID Tok_menos Tok_menos Tok_par2 BLOQUE {$$=new AST_Node("FOR","FOR",this._$.first_line,@1.last_column); $$.addChilds($3,$5,$7,$11,"decremento")}
   | Tok_for Tok_par1 DECLARACIONyASIGNACION Tok_pyc EXP Tok_pyc ASIGNACION Tok_par2 BLOQUE {$$=new AST_Node("FOR","FOR",this._$.first_line,@1.last_column); $$.addChilds($3,$5,$7,$9,"asigna")}
   | Tok_for Tok_par1 DECLARACIONyASIGNACION Tok_pyc EXP Tok_pyc Tok_ID Tok_mas Tok_mas Tok_par2 BLOQUE {$$=new AST_Node("FOR","FOR",this._$.first_line,@1.last_column); $$.addChilds($3,$5,$7,$11,"asigna_incre")}
   | Tok_for Tok_par1 DECLARACIONyASIGNACION Tok_pyc EXP Tok_pyc Tok_ID Tok_menos Tok_menos Tok_par2 BLOQUE {$$=new AST_Node("FOR","FOR",this._$.first_line,@1.last_column); $$.addChilds($3,$5,$7,$11,"asigna_decre")}
;

METODOS: Tok_ID Tok_par1 Tok_par2 BLOQUE {$$=new AST_Node("METODO_SIN_PA","METODO_SIN_PA",this._$.first_line,@1.last_column);$$.addChilds($1,$4);}
        |Tok_run Tok_ID Tok_par1 Tok_par2 BLOQUE {$$=new AST_Node("METODO_SIN_RUN","METODO_SIN_RUN",this._$.first_line,@1.last_column);$$.addChilds($2,$5);}
        |Tok_ID Tok_par1 Tok_par2 Tok_dospuntos Tok_void BLOQUE {$$=new AST_Node("METODO_SIN_PA","METODO_SIN_PA",this._$.first_line,@1.last_column);$$.addChilds($1,$6);}
        |Tok_run Tok_ID Tok_par1 Tok_par2 Tok_dospuntos Tok_void BLOQUE {$$=new AST_Node("METODO_SIN_RUN","METODO_SIN_RUN",this._$.first_line,@1.last_column);$$.addChilds($2,$7);}
        //CON PARAMETOS
        |Tok_ID Tok_par1 LISTA_PARAMETROS Tok_par2 BLOQUE {$$=new AST_Node("METODO_CON_PA","METODO_CON_PA",this._$.first_line,@1.last_column);$$.addChilds($1,$3,$5);}
        |Tok_run Tok_ID Tok_par1 LISTA_PARAMETROS Tok_par2 BLOQUE {$$=new AST_Node("METODO_CON_RUN","METODO_CON_RUN",this._$.first_line,@1.last_column);$$.addChilds($2,$4,$6);}
        |Tok_ID Tok_par1 LISTA_PARAMETROS Tok_par2 Tok_dospuntos Tok_void BLOQUE {$$=new AST_Node("METODO_CON_PA","METODO_CON_PA",this._$.first_line,@1.last_column);$$.addChilds($1,$3,$7);}
        |Tok_run Tok_ID Tok_par1 LISTA_PARAMETROS Tok_par2 Tok_dospuntos Tok_void BLOQUE {$$=new AST_Node("METODO_CON_RUN","METODO_CON_RUN",this._$.first_line,@1.last_column);$$.addChilds($2,$4,$8);}
        //TIPOS INT, DOUBLE, boolean, string, char
        |Tok_run Tok_ID Tok_par1 Tok_par2 Tok_dospuntos Tok_TD_int BLOQUE {$$=new AST_Node("METODO_SIN_RUN","METODO_SIN_RUN",this._$.first_line,@1.last_column);$$.addChilds($2,$7);}
        |Tok_run Tok_ID Tok_par1 Tok_par2 Tok_dospuntos Tok_TD_double BLOQUE {$$=new AST_Node("METODO_SIN_RUN","METODO_SIN_RUN",this._$.first_line,@1.last_column);$$.addChilds($2,$7);}
        |Tok_run Tok_ID Tok_par1 Tok_par2 Tok_dospuntos Tok_TD_boolean BLOQUE {$$=new AST_Node("METODO_SIN_RUN","METODO_SIN_RUN",this._$.first_line,@1.last_column);$$.addChilds($2,$7);}
        |Tok_run Tok_ID Tok_par1 Tok_par2 Tok_dospuntos Tok_TD_string BLOQUE {$$=new AST_Node("METODO_SIN_RUN","METODO_SIN_RUN",this._$.first_line,@1.last_column);$$.addChilds($2,$7);}
        |Tok_run Tok_ID Tok_par1 Tok_par2 Tok_dospuntos Tok_TD_char BLOQUE {$$=new AST_Node("METODO_SIN_RUN","METODO_SIN_RUN",this._$.first_line,@1.last_column);$$.addChilds($2,$7);}
        |Tok_run Tok_ID Tok_par1 LISTA_PARAMETROS Tok_par2 Tok_dospuntos Tok_TD_int BLOQUE {$$=new AST_Node("METODO_CON_RUN","METODO_CON_RUN",this._$.first_line,@1.last_column);$$.addChilds($2,$4,$8);}
        |Tok_run Tok_ID Tok_par1 LISTA_PARAMETROS Tok_par2 Tok_dospuntos Tok_TD_double BLOQUE {$$=new AST_Node("METODO_CON_RUN","METODO_CON_RUN",this._$.first_line,@1.last_column);$$.addChilds($2,$4,$8);}
        |Tok_run Tok_ID Tok_par1 LISTA_PARAMETROS Tok_par2 Tok_dospuntos Tok_TD_boolean BLOQUE {$$=new AST_Node("METODO_CON_RUN","METODO_CON_RUN",this._$.first_line,@1.last_column);$$.addChilds($2,$4,$8);}
        |Tok_run Tok_ID Tok_par1 LISTA_PARAMETROS Tok_par2 Tok_dospuntos Tok_TD_string BLOQUE {$$=new AST_Node("METODO_CON_RUN","METODO_CON_RUN",this._$.first_line,@1.last_column);$$.addChilds($2,$4,$8);}
        |Tok_run Tok_ID Tok_par1 LISTA_PARAMETROS Tok_par2 Tok_dospuntos Tok_TD_char BLOQUE {$$=new AST_Node("METODO_CON_RUN","METODO_CON_RUN",this._$.first_line,@1.last_column);$$.addChilds($2,$4,$8);}
;

FUNCIONES: Tok_ID Tok_par1 Tok_par2 Tok_dospuntos Tok_TD_int BLOQUE {$$=new AST_Node("FUNCION_SIN_PA","FUNCION_SIN_PA",this._$.first_line,@1.last_column);$$.addChilds($1,$6,$5);}
        |Tok_ID Tok_par1 Tok_par2 Tok_dospuntos Tok_TD_double BLOQUE {$$=new AST_Node("FUNCION_SIN_PA","FUNCION_SIN_PA",this._$.first_line,@1.last_column);$$.addChilds($1,$6,$5);}
        |Tok_ID Tok_par1 Tok_par2 Tok_dospuntos Tok_TD_boolean BLOQUE {$$=new AST_Node("FUNCION_SIN_PA","FUNCION_SIN_PA",this._$.first_line,@1.last_column);$$.addChilds($1,$6,$5);}
        |Tok_ID Tok_par1 Tok_par2 Tok_dospuntos Tok_TD_string BLOQUE {$$=new AST_Node("FUNCION_SIN_PA","FUNCION_SIN_PA",this._$.first_line,@1.last_column);$$.addChilds($1,$6,$5);}
        |Tok_ID Tok_par1 Tok_par2 Tok_dospuntos Tok_TD_char BLOQUE {$$=new AST_Node("FUNCION_SIN_PA","FUNCION_SIN_PA",this._$.first_line,@1.last_column);$$.addChilds($1,$6,$5);}
        //CON PARAMETOS
        |Tok_ID Tok_par1 LISTA_PARAMETROS Tok_par2 Tok_dospuntos Tok_TD_int BLOQUE {$$=new AST_Node("FUNCION_CON_PA","FUNCION_CON_PA",this._$.first_line,@1.last_column);$$.addChilds($1,$3,$7,$6);}
        |Tok_ID Tok_par1 LISTA_PARAMETROS Tok_par2 Tok_dospuntos Tok_TD_double BLOQUE {$$=new AST_Node("FUNCION_CON_PA","FUNCION_CON_PA",this._$.first_line,@1.last_column);$$.addChilds($1,$3,$7,$6);}
        |Tok_ID Tok_par1 LISTA_PARAMETROS Tok_par2 Tok_dospuntos Tok_TD_boolean BLOQUE {$$=new AST_Node("FUNCION_CON_PA","FUNCION_CON_PA",this._$.first_line,@1.last_column);$$.addChilds($1,$3,$7,$6);}
        |Tok_ID Tok_par1 LISTA_PARAMETROS Tok_par2 Tok_dospuntos Tok_TD_string BLOQUE {$$=new AST_Node("FUNCION_CON_PA","FUNCION_CON_PA",this._$.first_line,@1.last_column);$$.addChilds($1,$3,$7,$6);}
        |Tok_ID Tok_par1 LISTA_PARAMETROS Tok_par2 Tok_dospuntos Tok_TD_char BLOQUE {$$=new AST_Node("FUNCION_CON_PA","FUNCION_CON_PA",this._$.first_line,@1.last_column);$$.addChilds($1,$3,$7,$6);}
;

LLAMADAS: Tok_ID Tok_par1 Tok_par2 {$$=new AST_Node("LLAMADA_MSIN_PA","LLAMADA_MSIN_PA",this._$.first_line,@1.last_column);$$.addChilds($1);}
        | Tok_run Tok_ID Tok_par1 Tok_par2 {$$=new AST_Node("LLAMADA_MSIN_RUN","LLAMADA_MSIN_RUN",this._$.first_line,@1.last_column);$$.addChilds($2);}
        //METODOS CON PARAMETOS
        | Tok_ID Tok_par1 LISTA_EXP Tok_par2 {$$=new AST_Node("LLAMADA_MCON_PA","LLAMADA_MCON_PA",this._$.first_line,@1.last_column);$$.addChilds($1,$3);}
        | Tok_run Tok_ID Tok_par1 LISTA_EXP Tok_par2 {$$=new AST_Node("LLAMADA_MCON_RUN","LLAMADA_MCON_RUN",this._$.first_line,@1.last_column);$$.addChilds($2,$4);}
;

LISTA_EXP:LISTA_EXP Tok_coma EXP {$1.addChilds($3);$$=$1}
         | EXP {$$=new AST_Node("LISTA_EXP","LISTA_EXP",this._$.first_line,@1.last_column);$$.addChilds($1);}
;

PRINT: Tok_print Tok_par1 EXP Tok_par2 Tok_pyc {$$= new AST_Node("PRINT","PRINT",this._$.first_line,@1.last_column); $$.addChilds($3);};

PRINTLN: Tok_println Tok_par1 EXP Tok_par2 Tok_pyc {$$= new AST_Node("PRINTLN","PRINTLN",this._$.first_line,@1.last_column); $$.addChilds($3);};

MODIFICA_VECTOR: Tok_ID Tok_cor1 EXP Tok_cor2 Tok_asigna1 EXP {$$=new AST_Node("MODIFICA_VECTOR","MODIFICA_VECTOR",this._$.first_line,@1.last_column); $$.addChilds($1,$3,$6);}
                |Tok_ID Tok_cor1 EXP Tok_cor2 Tok_cor1 EXP Tok_cor2 Tok_asigna1 EXP {$$=new AST_Node("MODIFICA_VECTOR2","MODIFICA_VECTOR2",this._$.first_line,@1.last_column); $$.addChilds($1,$3,$6,$9);}
;


LISTA_PARAMETROS: LISTA_PARAMETROS Tok_coma TIPO_IDENTIFICADOR Tok_ID {$1.addChilds($3,$4,"");$$=$1}
                | TIPO_IDENTIFICADOR Tok_ID {$$=new AST_Node("LISTA_PARAMETROS","LISTA_PARAMETROS",this._$.first_line,@1.last_column);$$.addChilds($1,$2,"");}
                | LISTA_PARAMETROS Tok_coma TIPO_IDENTIFICADOR Tok_cor1 Tok_cor2 Tok_ID {$1.addChilds($3,$6,$4);$$=$1}
                | TIPO_IDENTIFICADOR Tok_cor1 Tok_cor2 Tok_ID {$$=new AST_Node("LISTA_PARAMETROS","LISTA_PARAMETROS",this._$.first_line,@1.last_column);$$.addChilds($1,$4,$2);}
;

TIPO_IDENTIFICADOR:Tok_TD_int {$$=$1}
                  |Tok_TD_double {$$=$1}
                  |Tok_TD_boolean {$$=$1}
                  |Tok_TD_string {$$=$1}
                  |Tok_TD_char {$$=$1}
;

OPTERNARIO:EXP Tok_igual EXP Tok_interrogacion EXP Tok_dospuntos EXP {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3,$5,$7);}
          |EXP Tok_diferente EXP Tok_interrogacion EXP Tok_dospuntos EXP {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3,$5,$7);}
          |EXP Tok_menor EXP Tok_interrogacion EXP Tok_dospuntos EXP {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3,$5,$7);}
          |EXP Tok_menori EXP Tok_interrogacion EXP Tok_dospuntos EXP {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3,$5,$7);}
          |EXP Tok_mayor EXP Tok_interrogacion EXP Tok_dospuntos EXP {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3,$5,$7);}
          |EXP Tok_mayori EXP Tok_interrogacion EXP Tok_dospuntos EXP {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3,$5,$7);}
;

CASTEOS:Tok_par1 Tok_TD_int Tok_par2 EXP {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("casteo_entero",$4,this._$.first_line,@1.last_column));}
       |Tok_par1 Tok_TD_double Tok_par2 EXP {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("casteo_double",$4,this._$.first_line,@1.last_column));}
       |Tok_par1 Tok_TD_char Tok_par2 EXP {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("casteo_char",$4,this._$.first_line,@1.last_column));}
       |Tok_tostring Tok_par1 EXP Tok_par2 {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("casteo_string",$3,this._$.first_line,@1.last_column));}
;

BREAK: Tok_break Tok_pyc {$$= new AST_Node("BREAK","BREAK",this._$.first_line,@1.last_column); $$.addChilds($1);}
;

CONTINUE: Tok_continue Tok_pyc {$$= new AST_Node("CONTINUE","CONTINUE",this._$.first_line,@1.last_column); $$.addChilds($1);}
;

RETURN: Tok_return Tok_pyc {$$= new AST_Node("RETURN","RETURN",this._$.first_line,@1.last_column); $$.addChilds($1);}
      | Tok_return EXP Tok_pyc {$$= new AST_Node("RETURN_VALOR","RETURN_VALOR",this._$.first_line,@1.last_column); $$.addChilds($1,$2);}
;

EXP: EXP Tok_mas EXP                    {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_menos EXP                  {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_por EXP                    {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_div EXP                    {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_pot EXP                    {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_mod EXP                    {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_diferente EXP              {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_igual EXP                  {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_mayor EXP                  {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_menor EXP                  {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_mayori EXP                 {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_menori EXP                 {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_and EXP                    {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_or EXP                     {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |OPTERNARIO                         {$$=$1}
    |CASTEOS                            {$$=$1}
    |EXP Tok_mas Tok_mas                {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("incremento",$1,this._$.first_line,@1.last_column));}
    |EXP Tok_menos Tok_menos            {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("decremento",$1,this._$.first_line,@1.last_column));}
    |Tok_not EXP                        {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds(new AST_Node("op",$1,this._$.first_line,@1.last_column),$2);}
    |Tok_par1 EXP Tok_par2              {$$=$2}
    |Tok_menos ENTERO %prec UMENOS      {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("entero",$2*-1,this._$.first_line,@1.last_column));}
    |Tok_menos Tok_numero %prec UMENOS  {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("decimal",$2*-1,this._$.first_line,@1.last_column));}
    |Tok_menos Tok_ID %prec UMENOS  {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("id_umenos",$2,this._$.first_line,@1.last_column));}
    |Tok_menos Tok_true %prec UMENOS    {L_Error.getInstance().insertar(new N_Error("Semantico","No esta permitida la negacion unario en esta expresion" ,this._$.first_line,@1.last_column));}
    |Tok_menos Tok_false %prec UMENOS   {L_Error.getInstance().insertar(new N_Error("Semantico","No esta permitida la negacion unario en esta expresion" ,this._$.first_line,@1.last_column));}
    |Tok_menos Tok_string %prec UMENOS  {L_Error.getInstance().insertar(new N_Error("Semantico","No esta permitida la negacion unario en esta expresion" ,this._$.first_line,@1.last_column));}
    |Tok_menos Tok_char %prec UMENOS    {L_Error.getInstance().insertar(new N_Error("Semantico","No esta permitida la negacion unario en esta expresion" ,this._$.first_line,@1.last_column));}
    |Tok_string                         {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);
                                         var text = $1.substr(0,$1.length);
                                         text=text.replace(/\\n/g,"\n");
                                         text=text.replace(/\\t/g,"\t");
                                         text=text.replace(/\\r/g,"\r");
                                         text=text.replace(/\\\\/g,"\\");
                                         text=text.replace(/\\\"/g,"\"");
                                         text=text.replace(/\\\'/g,"\'");
                                        $$.addChilds(new AST_Node("string",text,this._$.first_line,@1.last_column));}
    |Tok_char                           {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);
                                         var text2 = $1.substr(0,$1.length);
                                         text2=text2.replace(/\\n/g,"\n");
                                         text2=text2.replace(/\\t/g,"\t");
                                         text2=text2.replace(/\\r/g,"\r");
                                         text2=text2.replace(/\\\\/g,"\\");
                                         text2=text2.replace(/\\\"/g,"\"");
                                         text2=text2.replace(/\\\'/g,"\'");
                                        $$.addChilds(new AST_Node("char",text2,this._$.first_line,@1.last_column));}
    |ENTERO                             {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("entero",$1,this._$.first_line,@1.last_column));}                                    
    |Tok_numero                         {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("decimal",$1,this._$.first_line,@1.last_column));}
    |Tok_true                           {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("true",$1,this._$.first_line,@1.last_column));}
    |Tok_false                          {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("false",$1,this._$.first_line,@1.last_column));}
    |Tok_ID                             {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("id",$1,this._$.first_line,@1.last_column));}
    |Tok_toLower Tok_par1 EXP Tok_par2 {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("tolower",$3,this._$.first_line,@1.last_column));}
    |Tok_toupper Tok_par1 EXP Tok_par2 {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("toupper",$3,this._$.first_line,@1.last_column));}
    |Tok_round Tok_par1 EXP Tok_par2 {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("round",$3,this._$.first_line,@1.last_column));}
    |Tok_typeof Tok_par1 EXP Tok_par2 {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("typeof",$3,this._$.first_line,@1.last_column));}
    |Tok_ID Tok_cor1 EXP Tok_cor2 {$$= new AST_Node("acceso_vector","acceso_vector",this._$.first_line,@1.last_column);$$.addChilds($1,$3);}
    |Tok_ID Tok_cor1 EXP Tok_cor2 Tok_cor1 EXP Tok_cor2 {$$= new AST_Node("acceso_vector2","acceso_vector2",this._$.first_line,@1.last_column);$$.addChilds($1,$3,$6);}
    |Tok_length Tok_par1 EXP Tok_par2 {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("length",$3,this._$.first_line,@1.last_column));}
    |Tok_tochararray Tok_par1 EXP Tok_par2 {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("tochararray",$3,this._$.first_line,@1.last_column));}
    |Tok_ID Tok_par1 Tok_par2 {$$= new AST_Node("retorno_sin","retorno_sin",this._$.first_line,@1.last_column);$$.addChilds($1);}
    |Tok_ID Tok_par1 LISTA_EXP Tok_par2 {$$= new AST_Node("retorno_con","retorno_con",this._$.first_line,@1.last_column);$$.addChilds($1,$3);}
    ;


