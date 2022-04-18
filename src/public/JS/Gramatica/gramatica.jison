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
           |INCREMENTO_DECREMENTO Tok_pyc{$$=$1}
           |BLOQUE{$$=$1}
           |IF{$$=$1}
           |WHILE{$$=$1}
           |DO_WHILE Tok_pyc{$$=$1}
           |PRINT{$$=$1}
           |PRINTLN{$$=$1}
           |SWITCH{$$=$1}
           |FOR{$$=$1}
           |METODOS{$$=$1}
           |LLAMADAS{$$=$1}
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
;

LLAMADAS: Tok_ID Tok_par1 Tok_par2 Tok_pyc {$$=new AST_Node("LLAMADA_MSIN_PA","LLAMADA_MSIN_PA",this._$.first_line,@1.last_column);$$.addChilds($1);}
;

PRINT: Tok_print Tok_par1 EXP Tok_par2 Tok_pyc {$$= new AST_Node("PRINT","PRINT",this._$.first_line,@1.last_column); $$.addChilds($3);};

PRINTLN: Tok_println Tok_par1 EXP Tok_par2 Tok_pyc {$$= new AST_Node("PRINTLN","PRINTLN",this._$.first_line,@1.last_column); $$.addChilds($3);};

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
    ;


